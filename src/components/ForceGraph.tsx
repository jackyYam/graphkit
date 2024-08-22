import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d'
import type { ForceGraphInputType, CustomNodeObject, CustomLinkObject } from './nodesEdgesTypes'
import { TestNodeData } from '@/lib/exmapleData'

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
  ForwardedRef,
  MutableRefObject,
} from 'react'
import type {
  NodeObject,
  LinkObject,
  ForceGraphProps as ForGraphPropsBase,
} from 'react-force-graph-2d'

interface drawNodeBase {
  x: number
  y: number
  radius: number
  width: number
  height: number
  ctx: CanvasRenderingContext2D
}

interface drawNodeShapeProps extends drawNodeBase {
  label: string
  node: NodeObject
  maxLabelLength: number
}

interface drawNodeRingProps extends drawNodeBase {
  offset: number
  ringWidth: number
  ringColor: string
  globalScale: number
}

interface ForceGraphProps<NodeData> extends ForGraphPropsBase {
  zoomLevel: number
  selectedNodeID: string | null
  data: ForceGraphInputType<NodeData>
  onNodeSingleClick: (node: NodeObject | CustomNodeObject<NodeData>) => void
  onNodeDoubleClick: (node: NodeObject | CustomNodeObject<NodeData>) => void
}

const ForceGraph = forwardRef<ForceGraphMethods, ForceGraphProps<any>>(
  <NodeData,>(props: ForceGraphProps<NodeData>, ref: ForwardedRef<ForceGraphMethods>) => {
    const figRef = ref as MutableRefObject<ForceGraphMethods>
    const { zoomLevel, selectedNodeID, data, onNodeSingleClick, onNodeDoubleClick, ...restProps } =
      props
    const width = 680
    const height = 720
    const [highlightNodes, setHighlightNodes] = useState(new Set())
    const [highlightLinks, setHighlightLinks] = useState(new Set())
    const [hoverNode, setHoverNode] = useState<NodeObject | null>(null)
    const clickTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      figRef.current?.zoom(zoomLevel)
    }, [zoomLevel, figRef])

    const updateHighlight = () => {
      setHighlightNodes(highlightNodes)
      setHighlightLinks(highlightLinks)
    }

    const handleNodeHover = (node: NodeObject | null) => {
      highlightNodes.clear()
      highlightLinks.clear()
      if (node) {
        highlightNodes.add(node)
        node.neighbors.forEach((neighbor: NodeObject) => highlightNodes.add(neighbor))
        node.links.forEach((link: LinkObject) => highlightLinks.add(link))
      }

      setHoverNode(node || null)
      updateHighlight()
    }

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

    const drawNodeShape = useCallback(
      ({ x, y, radius, width, height, ctx, label, node, maxLabelLength }: drawNodeShapeProps) => {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        ctx.fillStyle = node.isMain ? node.color : node.secondColor
        ctx.fill()
        // Draw text inside the node
        ctx.fillStyle = node.isMain ? 'white' : 'black' // Text color
        let truncatedLabel = label
        if (label.length > maxLabelLength) {
          truncatedLabel = label.substring(0, maxLabelLength - 3) + '...'
        }
        ctx.fillText(truncatedLabel, node.x ?? 0, node.y ?? 0)
      },
      []
    )

    const drawNodeRing = useCallback(
      ({
        x,
        y,
        ctx,
        radius,
        offset,
        ringWidth,
        ringColor,
        globalScale,
        width,
        height,
      }: drawNodeRingProps) => {
        ctx.beginPath()
        ctx.moveTo(x + radius, y - offset)
        ctx.lineTo(x + width - radius, y - offset)
        ctx.quadraticCurveTo(x + width + offset, y - offset, x + width + offset, y + radius)
        ctx.lineTo(x + width + offset, y + height - radius)
        ctx.quadraticCurveTo(
          x + width + offset,
          y + height + offset,
          x + width - radius,
          y + height + offset
        )
        ctx.lineTo(x + radius, y + height + offset)
        ctx.quadraticCurveTo(x - offset, y + height + offset, x - offset, y + height - radius)
        ctx.lineTo(x - offset, y + radius)
        ctx.quadraticCurveTo(x - offset, y - offset, x + radius, y - offset)
        ctx.closePath()
        ctx.strokeStyle = ringColor // Ring color
        ctx.lineWidth = ringWidth // Adjust the ring width as needed
        ctx.stroke()
      },
      []
    )

    return (
      <ForceGraph2D
        width={width}
        height={height}
        ref={figRef}
        graphData={data}
        cooldownTicks={500}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        nodeLabel={() => ''}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label as string
          const fontSize = 12 / globalScale // Adjust font size as needed
          const maxLabelLength = 14
          ctx.font = `${fontSize}px Sans-Serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = 'white' // Text color
          const scaleFactor = 0.9 // Adjust this value to control the scaling rate
          const width = 87 / Math.pow(globalScale, scaleFactor)
          const height = 30 / Math.pow(globalScale, scaleFactor)
          const radius = 15 / Math.pow(globalScale, scaleFactor) // Adjusted radius to fit within the height
          const x = (node.x ?? 0) - width / 2
          const y = node.y ? node.y - height / 2 : 0
          const ringOffset = 5 / globalScale
          const ringWidth = 8 / globalScale
          const ringColor = 'rgba(79, 79, 79, 0.3)'

          drawNodeShape({ x, y, radius, width, height, ctx, label, node, maxLabelLength })

          if (node.id === selectedNodeID) {
            drawNodeRing({
              x,
              y,
              radius,
              offset: ringOffset,
              ringWidth,
              ringColor,
              ctx,
              globalScale,
              width,
              height,
            })
          } else if (node === hoverNode) {
            drawNodeRing({
              x,
              y,
              radius,
              offset: ringOffset,
              ringWidth,
              ringColor: 'red',
              ctx,
              globalScale,
              width,
              height,
            })
          } else if (highlightNodes.has(node)) {
            drawNodeRing({
              x,
              y,
              radius,
              offset: ringOffset,
              ringWidth,
              ringColor: 'lightblue',
              ctx,
              globalScale,
              width,
              height,
            })
          }
        }}
        onNodeHover={handleNodeHover}
        enableNodeDrag
        onNodeClick={handleNodeClick}
        onNodeDragEnd={(node) => {
          node.fx = node.x
          node.fy = node.y
          node.fz = node.z
        }}
        linkCanvasObjectMode={() => 'after'}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 4 : 0)}
        linkCanvasObject={(link, ctx, globalScale) => {
          if (globalScale < 3 || !link.label) {
            return // Do not render the label if the zoom level is below the threshold
          }
          const label = link.label
          const fontSize = 11 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const textWidth = ctx.measureText(label).width
          const wPadding = 8 / globalScale
          const hPadding = 4 / globalScale
          const boxWidth = textWidth + wPadding * 2
          const boxHeight = fontSize + hPadding * 2

          const sourceNode = link.source as NodeObject
          const targetNode = link.target as NodeObject

          // Calculate the x and y positions at 25% of the way from source to target
          const x = (sourceNode.x ?? 0) + ((targetNode.x ?? 0) - (sourceNode.x ?? 0)) * 0.35
          const y = (sourceNode.y ?? 0) + ((targetNode.y ?? 0) - (sourceNode.y ?? 0)) * 0.35

          // Draw the background box for the label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight)

          // Draw the border around the label box
          ctx.strokeStyle = 'black'
          ctx.lineWidth = 1.5 / globalScale
          ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight)

          // Draw the label text
          ctx.fillStyle = 'black'
          ctx.fillText(label, x, y)
        }}
        {...restProps}
      />
    )
  }
)

export default ForceGraph
