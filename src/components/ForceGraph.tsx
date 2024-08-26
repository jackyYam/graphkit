import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d'
import type { ForceGraphInputType, CustomNodeObject, CustomLinkObject } from './nodesEdgesTypes'
import { TestNodeData } from '@/lib/exmapleData'
import useNodeHighlight from '@/lib/nodeInteractions'
import type { NodeDrawingSettings } from '@/lib/drawings'
import {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
  ForwardedRef,
  MutableRefObject,
  useMemo,
} from 'react'
import type {
  NodeObject,
  LinkObject,
  ForceGraphProps as ForGraphPropsBase,
} from 'react-force-graph-2d'
import { useZoomLevel } from '@/lib/hooks'
import { Button } from './ui/button'
import { Plus, Minus } from 'lucide-react'
import React from 'react'
interface ForceGraphProps<NodeData> extends ForGraphPropsBase {
  zoomLevel: number
  selectedNodeID: string | null
  data: ForceGraphInputType<NodeData>
  showLabelOnHover: boolean
  fixNodeOnDrag: boolean
  nodeDrawingSettings: NodeDrawingSettings
  onNodeSingleClick: (node: NodeObject) => void
  onNodeDoubleClick: (node: NodeObject) => void
}

const ForceGraph = forwardRef<ForceGraphMethods, ForceGraphProps<any>>(
  <NodeData,>(props: ForceGraphProps<NodeData>, ref: ForwardedRef<ForceGraphMethods>) => {
    const figRef = ref as MutableRefObject<ForceGraphMethods>
    const {
      selectedNodeID,
      data,
      onNodeSingleClick,
      onNodeDoubleClick,
      showLabelOnHover,
      nodeDrawingSettings,
      fixNodeOnDrag,
      ...restProps
    } = props
    const width = 680
    const height = 720

    const clickTimeout = useRef<NodeJS.Timeout | null>(null)

    const { handleMouseDown, handleMouseUp, handleClick, zoomLevel } = useZoomLevel()

    useEffect(() => {
      figRef.current?.zoom(zoomLevel)
    }, [zoomLevel, figRef])

    useEffect(() => {
      figRef.current?.d3Force('link')?.distance(30).strength(0.2)
      figRef.current?.d3Force('charge')?.strength(-40)
    }, [figRef])

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

    return (
      <div className="w-full h-full relative">
        <ForceGraph2D
          width={width}
          height={height}
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
        </div>
      </div>
    )
  }
)

export default ForceGraph
