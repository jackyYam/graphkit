import type { simpleForceSettings } from '@/lib/forces'
import { useZoomControl } from '@/lib/hooks'
import { useZoomStore } from '@/stores/graphstore'
import { Minus, Plus } from 'lucide-react'
import { ForwardedRef, forwardRef, MutableRefObject, useCallback, useEffect, useRef } from 'react'
import type { ForceGraphProps as ForGraphPropsBase, NodeObject } from 'react-force-graph-2d'
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d'
import type { ForceGraphInputType } from '../lib/nodesEdgesTypes'
import { Button } from './ui/button'

interface ForceGraphProps<NodeData> extends ForGraphPropsBase {
  initialZoomLevel?: number
  data: ForceGraphInputType<NodeData>
  showLabelOnHover?: boolean
  fixNodeOnDrag?: boolean
  simpleForceSettings?: simpleForceSettings
  showDefaultZoomControl?: boolean
  ZoomControlComponente?: React.ComponentType
  onNodeSingleClick: (node: NodeObject) => void
  onNodeDoubleClick: (node: NodeObject) => void
  FooterNoteComponent?: React.ComponentType
}

const ForceGraph = forwardRef<ForceGraphMethods, ForceGraphProps<any>>(
  <NodeData,>(props: ForceGraphProps<NodeData>, ref: ForwardedRef<ForceGraphMethods>) => {
    const figRef = ref as MutableRefObject<ForceGraphMethods>
    const {
      initialZoomLevel = 2.8,
      data,
      onNodeSingleClick,
      onNodeDoubleClick,
      showLabelOnHover = false,
      fixNodeOnDrag = true,
      simpleForceSettings,
      showDefaultZoomControl = true,
      ZoomControlComponente,
      FooterNoteComponent,
      ...restProps
    } = props

    const clickTimeout = useRef<NodeJS.Timeout | null>(null)

    const { handleMouseDown, handleMouseUp, handleClick } = useZoomControl()
    const zoomLevel = useZoomStore((state) => state.zoomLevel)
    const setZoomLevel = useZoomStore((state) => state.setZoomLevel)

    useEffect(() => {
      setZoomLevel(initialZoomLevel)
    }, [initialZoomLevel, setZoomLevel])

    useEffect(() => {
      figRef.current?.zoom(zoomLevel)
    }, [zoomLevel, figRef])

    useEffect(() => {
      if (simpleForceSettings) {
        figRef.current
          ?.d3Force('link')
          ?.distance(simpleForceSettings.linkDistance)
          .strength(simpleForceSettings.linkStrength)
        figRef.current?.d3Force('charge')?.strength(simpleForceSettings.chargeStrength)
      }
    }, [figRef, simpleForceSettings])

    const handleNodeClick = useCallback(
      (node: NodeObject) => {
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current)
          clickTimeout.current = null
          onNodeDoubleClick(node)
        } else {
          clickTimeout.current = setTimeout(() => {
            onNodeSingleClick(node)
            clickTimeout.current = null
          }, 250)
        }
      },
      [onNodeDoubleClick, onNodeSingleClick]
    )
    const showCustomZoomControl = ZoomControlComponente && !showDefaultZoomControl

    return (
      <div className="w-full h-full relative">
        <ForceGraph2D
          ref={figRef}
          graphData={data}
          cooldownTicks={500}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={1}
          nodeLabel={(node) => (showLabelOnHover ? node.label : '')}
          enableNodeDrag
          onNodeClick={handleNodeClick}
          onNodeDragEnd={(node) => {
            if (fixNodeOnDrag) {
              node.fx = node.x
              node.fy = node.y
              node.fz = node.z
            }
          }}
          linkCanvasObjectMode={() => 'after'}
          {...restProps}
        />
        <div className="absolute bottom-2 left-0 flex justify-between w-full items-center px-3">
          {showDefaultZoomControl && (
            <div className="flex space-x-2">
              <Button
                className="rounded-full"
                variant="outline"
                size="icon"
                onMouseDown={() => handleMouseDown(true)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => handleClick(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-full"
                variant="outline"
                size="icon"
                onMouseDown={() => handleMouseDown(false)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => handleClick(false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          )}
          {showCustomZoomControl && <ZoomControlComponente />}
          {FooterNoteComponent && <FooterNoteComponent />}
        </div>
      </div>
    )
  }
)

export default ForceGraph
