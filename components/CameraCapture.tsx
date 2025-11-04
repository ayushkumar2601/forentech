
"use client"

import { useEffect, useRef } from "react"

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        // Wait for camera to stabilize, then capture automatically
        setTimeout(() => captureImage(), 1500)
      } catch (error) {
        console.error("Camera access denied:", error)
      }
    }

    initCamera()

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  function captureImage() {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/png")
    onCapture(dataUrl)
  }

  return (
    <div className="flex flex-col items-center gap-4 text-white p-4">
      <div className="relative border border-gray-700 rounded-lg overflow-hidden w-full max-w-[480px] bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="object-contain w-full h-[360px] bg-black"
        />
      </div>
    </div>
  )
}
