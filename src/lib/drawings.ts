import type { NodeObject } from 'react-force-graph-2d'
interface DrawNodeBase {
  x: number
  y: number
  radius: number
  width: number
  height: number
  ctx: CanvasRenderingContext2D
}

interface DrawCapsuleNodeProps extends DrawNodeBase {
  label: string
  node: NodeObject
  maxLabelLength: number
  mainTextColor?: string
  secondTextColor?: string
}

interface DrawCapsuleNodeRingProps extends DrawNodeBase {
  offset: number
  ringWidth: number
  ringColor: string
}

export type NodeDrawingSettings = {
  fontSize: number
  maxLabelLength: number
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  mainTextColor: string
  secondTextColor: string
  scaleFactor: number
  nodeWidth: number
  nodeHeight: number
  nodeRadius: number
  nodeRingOffset: number
  nodeRingWidth: number
  nodeRingColor: string
}

export const defaultNodeDrawingSettings: NodeDrawingSettings = {
  fontSize: 12,
  maxLabelLength: 14,
  textAlign: 'center',
  textBaseline: 'middle',
  mainTextColor: 'white',
  secondTextColor: 'black',
  scaleFactor: 0.9,
  nodeWidth: 87,
  nodeHeight: 30,
  nodeRadius: 15,
  nodeRingOffset: 5,
  nodeRingWidth: 8,
  nodeRingColor: 'blue',
}

export const drawCapsuleNode = ({
  x,
  y,
  radius,
  width,
  height,
  ctx,
  label,
  node,
  maxLabelLength,
  mainTextColor = 'white',
  secondTextColor = 'black',
}: DrawCapsuleNodeProps) => {
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
  ctx.fillStyle = node.isMain ? mainTextColor : secondTextColor // Text color
  let truncatedLabel = label
  if (label.length > maxLabelLength) {
    truncatedLabel = label.substring(0, maxLabelLength - 3) + '...'
  }
  ctx.fillText(truncatedLabel, node.x ?? 0, node.y ?? 0)
}

export const drawCapsuleNodeRing = ({
  x,
  y,
  ctx,
  radius,
  offset,
  ringWidth,
  ringColor,
  width,
  height,
}: DrawCapsuleNodeRingProps) => {
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
  ctx.strokeStyle = ringColor
  ctx.lineWidth = ringWidth
  ctx.stroke()
}

export const getScaledNodeSettings = (
  settings: NodeDrawingSettings,
  globalScale: number,
  node: NodeObject
) => {
  const nodeWidth = settings.nodeWidth / Math.pow(globalScale, settings.scaleFactor)
  const nodeHeight = settings.nodeHeight / Math.pow(globalScale, settings.scaleFactor)
  const nodeRadius = settings.nodeRadius / Math.pow(globalScale, settings.scaleFactor)
  return {
    fontSize: settings.fontSize / globalScale,
    nodeWidth,
    nodeHeight,
    nodeRadius,
    x: (node.x ?? 0) - nodeWidth / 2,
    y: node.y ? node.y - nodeHeight / 2 : 0,
    ringOffest: settings.nodeRingOffset / globalScale,
    ringWidth: settings.nodeRingWidth / globalScale,
  }
}
