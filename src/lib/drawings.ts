import type { LinkObject, NodeObject } from 'react-force-graph-2d'
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
    ringOffset: settings.nodeRingOffset / globalScale,
    ringWidth: settings.nodeRingWidth / globalScale,
  }
}

interface DrawLinkWithLabelProps {
  link: LinkObject
  ctx: CanvasRenderingContext2D
  globalScale: number
  scaleToShowLabel?: number
  labelFontSize?: number
  xPadding?: number
  yPadding?: number
  boxBackgroundColor?: string
  boxBorderColor?: string
  boxBorderWidth?: number
  textColor?: string
}

export const drawLinkWithLabel = ({
  link,
  ctx,
  globalScale,
  scaleToShowLabel = 3,
  labelFontSize = 11,
  xPadding = 8,
  yPadding = 4,
  boxBackgroundColor = '#ffffff',
  boxBorderColor = 'black',
  boxBorderWidth = 1.5,
  textColor = 'black',
}: DrawLinkWithLabelProps) => {
  if (globalScale < scaleToShowLabel || !link.label) {
    return // Do not render the label if the zoom level is below the threshold
  }
  const label = link.label
  const fontSize = labelFontSize / globalScale
  ctx.font = `${fontSize}px Sans-Serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const textWidth = ctx.measureText(label).width
  const wPadding = xPadding / globalScale
  const hPadding = yPadding / globalScale
  const boxWidth = textWidth + wPadding * 2
  const boxHeight = fontSize + hPadding * 2

  const sourceNode = link.source as NodeObject
  const targetNode = link.target as NodeObject

  // Calculate the x and y positions at 25% of the way from source to target
  const x = (sourceNode.x ?? 0) + ((targetNode.x ?? 0) - (sourceNode.x ?? 0)) * 0.35
  const y = (sourceNode.y ?? 0) + ((targetNode.y ?? 0) - (sourceNode.y ?? 0)) * 0.35

  // Draw the background box for the label
  ctx.fillStyle = boxBackgroundColor
  ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight)

  // Draw the border around the label box
  ctx.strokeStyle = boxBorderColor
  ctx.lineWidth = boxBorderWidth / globalScale
  ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight)

  // Draw the label text
  ctx.fillStyle = textColor
  ctx.fillText(label, x, y)
}
