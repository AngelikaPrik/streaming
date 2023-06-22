import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { downloadRecord, mergedStream } from './utils/app.func'

const videoPath = '/videos/test.mp4'

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const recorder = useRef<MediaRecorder | null>(null)

  const startRecord = async () => {
    const chunks: Blob[] = []

    recorder.current = new MediaRecorder(await mergedStream())
    recorder.current.ondataavailable = event => chunks.push(event.data)

    recorder.current.onstop = () => {
      const videoBlob = new Blob(chunks, { type: 'video/mp4' })
      const videoUrl = URL.createObjectURL(videoBlob)
      downloadRecord(videoUrl)
    }
    recorder.current.start()
    setIsRecording(true)
  }

  const saveRecord = () => {
    if (recorder.current) {
      recorder.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className='container'>
      <div className='container__video'>
        <video
          width='100%'
          height='100%'
          src={videoPath}
          typeof='video/mp4'
          controls
          autoPlay
        />
        <div className='container__webcam'>
          <Webcam height={160} />
        </div>
      </div>
      <button className='btn' onClick={startRecord} disabled={isRecording}>
        {!isRecording ? 'Начать запись' : 'Запись идет...'}
      </button>
      <button className='btn' onClick={saveRecord} disabled={!isRecording}>
        Остановить и сохранить запись
      </button>
    </div>
  )
}

export default App
