import { useState } from 'react'

export const useZoomLevel = (
  initialZoomLevel = 2.8,
  zoomStep = 0.5,
  clickZoomStep = 0.5,
  pressInterval = 150
) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel)
  const [zoomIntervalId, setZoomIntervalId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseDown = (zoomIn: boolean) => {
    const id = setInterval(() => {
      setZoomLevel((prev) => (zoomIn ? prev + zoomStep : prev - zoomStep))
    }, pressInterval) // Adjust the interval time as needed
    setZoomIntervalId(id)
  }
  const handleMouseUp = () => {
    if (zoomIntervalId) {
      clearInterval(zoomIntervalId)
      setZoomIntervalId(null)
    }
  }
  const handleClick = (zoomIn: boolean) => {
    setZoomLevel((prev) => (zoomIn ? prev + clickZoomStep : prev - clickZoomStep))
  }

  return { zoomLevel, handleMouseDown, handleMouseUp, handleClick }
}
