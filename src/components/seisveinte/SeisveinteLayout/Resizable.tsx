import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { PanelLeft } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

const MIN_SIZE_IN_PIXELS = 220
const WINDOW = 10
const MOBILE_WIDTH = 1024

function getMinSize(width: number) {
  return (MIN_SIZE_IN_PIXELS / width) * 100
}

export function Resizable({ children }: { children: React.ReactNode[] }) {
  const initialClientWidth = document.documentElement.clientWidth
  const lessThanMinWith = (currentWidth: number) => currentWidth < MOBILE_WIDTH
  const [minSize, setMinSize] = useState(getMinSize(initialClientWidth))
  const [lastWidth, setLastWidth] = useState(initialClientWidth)
  const [isCollapsed, setIsCollapsed] = useState(lessThanMinWith(initialClientWidth))
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null)
  const currentParentRef = sidebarPanelRef.current

  const expandSidebar = () => {
    if (currentParentRef) {
      currentParentRef.isExpanded() ? currentParentRef.collapse() : currentParentRef.expand()
    }
  }

  useLayoutEffect(() => {
    const panelGroup = document.querySelector('[data-panel-group-id="group"]')
    const resizeHandles = document.querySelectorAll('[data-panel-resize-handle-id]')
    if (!panelGroup) return
    const observer = new ResizeObserver(() => {
      const currentParentRef = sidebarPanelRef.current
      if (!currentParentRef) return
      let currentWidth = panelGroup.clientWidth
      resizeHandles.forEach((resizeHandle) => {
        currentWidth -= resizeHandle.clientWidth
      })
      setMinSize(getMinSize(currentWidth))
      if (lastWidth >= MOBILE_WIDTH && lessThanMinWith(currentWidth)) {
        currentParentRef.collapse()
      }
      if (lastWidth < MOBILE_WIDTH && !lessThanMinWith(currentWidth)) {
        currentParentRef.expand()
      }
      setLastWidth(currentWidth)
    })
    observer.observe(panelGroup)
    resizeHandles.forEach((resizeHandle) => {
      observer.observe(resizeHandle)
    })

    return () => {
      observer.disconnect()
    }
  }, [currentParentRef, lastWidth, minSize])

  return (
    <ResizablePanelGroup id="group" direction="horizontal" className="min-h-full">
      <ResizablePanel
        defaultSize={minSize}
        minSize={minSize}
        ref={sidebarPanelRef}
        id="sidebar-panel"
        collapsible
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => !lessThanMinWith(lastWidth) && setIsCollapsed(false)}
      >
        {children[0]}
      </ResizablePanel>
      <ResizableHandle id="horizontal-handle" />
      <ResizablePanel
        defaultSize={100 - minSize}
        minSize={100 - minSize - WINDOW}
        id="vertical-panel"
      >
        {isCollapsed && (
          <div className="absolute flex h-12 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-4 opacity-70 hover:bg-inherit hover:opacity-100"
              onClick={expandSidebar}
              hidden={!isCollapsed}
            >
              <PanelLeft />
            </Button>
          </div>
        )}
        {children[1]}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
