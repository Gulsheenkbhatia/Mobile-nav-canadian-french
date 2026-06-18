import { initProgressBar } from './shoppableVideoImage'

describe('initProgressBar', () => {
  it('should set the progress bar width based on video progress', () => {
    const videoElement = {
      currentTime: 5,
      duration: 10,
      addEventListener: (event, callback) => {
        if (event === 'timeupdate') {
          callback()
        }
      },
    }
    const videoProgressBar = { style: { transform: '' } }

    const node = {
      querySelectorAll: () => [
        {
          querySelector: (selector) => {
            if (selector === 'video') return videoElement
            if (selector === '.video-progress-filled') return videoProgressBar
          },
        },
      ],
    }

    initProgressBar(node)

    expect(videoProgressBar.style.transform).toBe('translateX(-50%)')
  })

  it('should not fail if progress bar element is missing', () => {
    const videoElement = {
      currentTime: 5,
      duration: 10,
      addEventListener: (event, callback) => {
        if (event === 'timeupdate') {
          callback()
        }
      },
    }

    const node = {
      querySelectorAll: () => [
        {
          querySelector: (selector) => {
            if (selector === 'video') return videoElement
            if (selector === '.video-progress-filled') return null
          },
        },
      ],
    }

    // No error should be thrown
    expect(() => initProgressBar(node)).not.toThrow()
  })
})
