const getColorString = (img: HTMLImageElement, context: CanvasRenderingContext2D) => {
  context.drawImage(img, 0, 0, img.width, img.height)
  const i = context.getImageData(0, 0, 1, 1).data
  return '#' + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1)
}

const getAverageColor = async (src: string): Promise<string> =>
  await new Promise((resolve, reject) => {
    const context = document.createElement('canvas').getContext('2d')

    if (!context) {
      return reject()
    }

    context.imageSmoothingEnabled = true

    let img = document.querySelector(`img[src="${src}"]`) as HTMLImageElement

    // If the image exists in DOM, we'll use it, to avoid a new request.
    if (img) {
      // If the image is not ready by the time we try to use it, we'll listen to the 'load' event.
      if (!img.complete) {
        img.onload = () => {
          const colorString = getColorString(img, context)
          resolve(colorString)
        }
        img.onerror = () => {
          reject()
        }
        return
      }

      // Otherwise we can use it immediately.
      const colorString = getColorString(img, context)
      return resolve(colorString)
    }

    // If the image is not in the DOM, then we'll request it again.
    img = new Image()
    img.onload = () => {
      const colorString = getColorString(img, context)
      resolve(colorString)
    }
    img.onerror = () => {
      reject()
    }
    img.crossOrigin = 'anonymous' // Needed to avoid the <canvas> being tainted, since the images are stored on another domain.
    img.src = src
  })

export default getAverageColor
