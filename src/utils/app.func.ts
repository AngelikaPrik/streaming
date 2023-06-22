interface IHTMLVideoElement extends HTMLVideoElement {
  captureStream(frameRate?: number): MediaStream
}

interface IGetCanvas {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
}

export async function mergedStream(): Promise<MediaStream> {
  const webCam = document.querySelector(
    '.container__webcam video'
  ) as CanvasImageSource
  const video = document.querySelector(
    '.container__video video'
  ) as CanvasImageSource

  const { canvas, context } = getCanvas()

  if (context) {
    (function draw() {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const w = 200
      const h = 150
      context.drawImage(webCam, canvas.width - w, canvas.height - h, w, h)

      requestAnimationFrame(draw)
    })()
  }
  const streamWebCam = await getWebCam()
  const streamVideo = getVideo()
  const stream = canvas.captureStream(25)

  getAudio(streamWebCam, streamVideo, stream)

  return stream
}

function getCanvas(): IGetCanvas {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = 1024
  canvas.height = 576

  return { canvas, context }
}

async function getWebCam() {
  return await navigator.mediaDevices.getUserMedia({ audio: true })
}

function getVideo(): MediaStream {
  const className = '.container__video video'
  const videoTag: IHTMLVideoElement | null = document.querySelector(className)

  if (videoTag) return videoTag.captureStream(25)
  else throw new Error('Не удалось получить видеопоток')
}

function getAudio<T extends MediaStream>(webCam: T, video: T, stream: T): void {
  webCam
    .getAudioTracks()
    .forEach((track: MediaStreamTrack) => stream.addTrack(track))
  video
    .getAudioTracks()
    .forEach((track: MediaStreamTrack) => stream.addTrack(track))
}

export function downloadRecord(videoUrl: string) {
  const downloadLink = document.createElement('a')
  downloadLink.href = videoUrl
  downloadLink.download = 'video.mp4'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)

  URL.revokeObjectURL(videoUrl)
}
