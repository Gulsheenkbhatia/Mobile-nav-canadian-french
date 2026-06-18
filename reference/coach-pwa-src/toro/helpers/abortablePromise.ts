/**
 * Custom error class to represent an abortion error.
 */
export class AbortError extends Error {
  constructor(message: string = 'Aborted') {
    super(message)
    this.name = 'AbortError'
  }
}

/**
 * Interface representing an abortable operation.
 */
interface Abortable {
  abort: () => void
}

type Executor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => void | Promise<T>

/**
 * An abortable extension of Promise class
 * @template T - The type of the resolved value.
 */
class AbortablePromise<T> extends Promise<T> implements Abortable {
  public abort: AbortController['abort']

  /**
   * Creates an instance of AbortablePromise.
   * @param {Executor<T>} executor - The executor function that is passed to the Promise constructor.
   */
  constructor(executor: Executor<T>) {
    const abortController = new AbortController()
    const abortableExecutor: Executor<T> = (resolve, reject) => {
      abortController.signal.addEventListener('abort', () => {
        reject(new AbortError())
      })
      executor(resolve, reject)
    }

    super(abortableExecutor)

    this.abort = () => {
      abortController.abort()
    }
  }
}

export default AbortablePromise
