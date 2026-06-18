import type {
  InvocationPayload,
  StreamHandlers,
  StreamOptions,
  StreamErrorPayload,
} from 'toro/components/ShopAssistChat/types'

const getErrorMessage = (abortReason: unknown, error: unknown) => {
  if (abortReason instanceof Error) return abortReason.message
  if (error instanceof Error && error.name === 'AbortError') return 'Backend request timed out'
  if (error instanceof Error) return error.message
  return 'Unknown error'
}

const toStreamErrorPayload = (
  signal: AbortSignal | undefined,
  error: unknown
): StreamErrorPayload => {
  const abortReason = signal?.aborted ? signal.reason : null
  const errorCode =
    (abortReason as { code?: string } | null)?.code ??
    (error instanceof Error && 'message' in error
      ? (error as { message?: string }).message
      : undefined)
  return {
    error: 'Streaming failed',
    code: errorCode,
    message: getErrorMessage(abortReason, error),
  }
}

const timeoutErrorCode = 'ERR_ABRUPT_STREAM_END'

const toInvocationBody = (payload: InvocationPayload) => ({
  prompt: payload.prompt,
  session_id: payload.sessionId ?? null,
  config_overrides: payload.configOverrides ?? {},
  user_context: payload.userContext ?? '',
  user_id: payload.userId,
  locale: payload.locale,
  client_metadata: payload.clientMetadata ?? {},
})

export async function streamShopAssistInvocation(
  url: string,
  payload: InvocationPayload,
  handlers: StreamHandlers,
  options: StreamOptions = {}
) {
  const streamReadTimeoutMs = Number(options.streamReadTimeoutMs)
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const resetTimeout = () => {
    if (!streamReadTimeoutMs) return
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      const timeoutError = Object.assign(new Error('Backend request timed out'), {
        code: timeoutErrorCode,
        name: 'AbortError',
      })
      options.abortController?.abort(timeoutError)
    }, streamReadTimeoutMs)
  }

  try {
    resetTimeout()
    let response: Response
    try {
      response = await (options.fetchImpl ?? fetch)(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {}),
        },
        body: JSON.stringify(toInvocationBody(payload)),
        signal: options.signal,
      })
    } catch (error) {
      throw new Error('NETWORK_ERROR')
    }

    if (!response.ok) {
      throw new Error('API_ERROR')
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No stream reader')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        if (handlers?.onEvent && typeof handlers.onEvent === 'function') {
          handlers?.onEvent({ type: 'STREAM_DONE' })
        }
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') continue

        if (line.startsWith('data: ')) {
          const dataStr = line.substring(6)
          resetTimeout()
          if (handlers.ignoreData?.(dataStr)) continue

          handlers.onData?.(dataStr)
          if (handlers.onEvent) {
            const parsed = handlers.parseData ? handlers.parseData(dataStr) : JSON.parse(dataStr)
            if (parsed.error && parsed.error !== 'Guardrail intervention') {
              throw new Error(parsed.message || 'Unknown streaming error')
            }
            handlers.onEvent(parsed)
          }
        } else {
          resetTimeout()
          handlers.onLine?.(line)
        }
      }
    }
  } catch (error) {
    const payload = toStreamErrorPayload(options.signal, error)
    if (handlers.onError) {
      handlers.onError(payload, error)
      return
    }
    throw error
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
