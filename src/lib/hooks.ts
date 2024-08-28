import { useState } from 'react'
import { useZoomStore } from '@/stores/graphstore'

export const useZoomControl = (zoomStep = 0.5, clickZoomStep = 0.5, pressInterval = 150) => {
  const adjustZoomLevel = useZoomStore((state) => state.adjustZoomLevel)
  const [zoomIntervalId, setZoomIntervalId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseDown = (zoomIn: boolean) => {
    const id = setInterval(() => {
      adjustZoomLevel(zoomIn ? zoomStep : 0 - zoomStep)
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
    adjustZoomLevel(zoomIn ? clickZoomStep : 0 - clickZoomStep)
  }

  return { handleMouseDown, handleMouseUp, handleClick }
}
