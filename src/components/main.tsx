import ForceGraph from './ForceGraph'
import { useEffect, useMemo, useRef, useState } from 'react'
import { categories } from '@/lib/exmapleData'
import { type ForceGraphInputType, CustomNodeObject } from '../lib/nodesEdgesTypes'
import { forceGraphData } from '@/lib/exmapleData'
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d'
import InfoCard from './InfoCard'
import { TestNodeData } from '@/lib/exmapleData'
import useNodeHighlight from '@/lib/nodeInteractions'
import { distantLayoutForce } from '@/lib/forces'
import {
  drawCapsuleNode,
  drawCapsuleNodeRing,
  drawLinkWithLabel,
  defaultNodeDrawingSettings,
  getScaledNodeSettings,
} from '@/lib/drawings'
import CategoryFilter from './CategoryFilter'
import { useGeneralSettingsStore } from '@/stores/graphstore'

const Graph = () => {
  const [selectedNodeID, setSelectedNodeID] = useState<string | null>(null)
  const [data, setData] = useState<ForceGraphInputType<TestNodeData>>(forceGraphData)
  const [shownData, setShownData] = useState<ForceGraphInputType<TestNodeData>>(data)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const forceGraphRef = useRef<ForceGraphMethods>(null)
  const { highlightNodes, highlightLinks, hoverNode, handleNodeHover } = useNodeHighlight()
  const setCategories = useGeneralSettingsStore((state) => state.setCategories)

  const selectedNode = useMemo(
    () => data.nodes.find((node) => node.id === selectedNodeID),
    [data.nodes, selectedNodeID]
  )

  useEffect(() => {
    setCategories(categories)
  }, [setCategories])

  const handleDoubleClick = (node: NodeObject) => {
    setData((prev) => {
      const newNodes: NodeObject[] = [
        { ...node, id: `${node.id}-1`, name: `${node.name}-1` },
        { ...node, id: `${node.id}-2`, name: `${node.name}-2` },
        { ...node, id: `${node.id}-3`, name: `${node.name}-3` },
      ]
      const updatedNodes = [...prev.nodes, ...newNodes]
      const newLinks = [
        { source: node, target: newNodes[1], id: `${node.id}-${newNodes[1].id}` },
        { source: node, target: newNodes[0], id: `${node.id}-${newNodes[0].id}` },
        { source: node, target: newNodes[2], id: `${node.id}-${newNodes[2].id}` },
      ]
      newLinks.forEach((link) => {
        const a = updatedNodes.find((n) => n.id === link.source.id)
        const b = updatedNodes.find((n) => n.id === link.target.id)
        if (a) {
          !a.neighbors && (a.neighbors = [])
          a.neighbors.push(b)
          !a.links && (a.links = [])
          a.links.push(link)
        }
        if (b) {
          !b.neighbors && (b.neighbors = [])
          b.neighbors.push(a)
          !b.links && (b.links = [])
          b.links.push(link)
        }
      })
      const newNodesFinal = [...prev.nodes, ...newNodes] as CustomNodeObject<TestNodeData>[]
      return { nodes: newNodesFinal, links: [...prev.links, ...newLinks] }
    })
  }

  useEffect(() => {
    if (categoryFilter.length === 0) {
      setShownData(data)
    } else {
      const filteredNodes = data.nodes.filter(
        (node) => !categoryFilter.includes(node.category as string)
      )
      const filteredLinks = data.links.filter(
        (link) =>
          filteredNodes.includes(link.source as CustomNodeObject<TestNodeData>) &&
          filteredNodes.includes(link.target as CustomNodeObject<TestNodeData>)
      )
      setShownData({ nodes: filteredNodes, links: filteredLinks })
    }
  }, [categoryFilter, data])

  const drawNode = (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const {
      fontSize,
      nodeHeight: height,
      nodeRadius: radius,
      nodeWidth: width,
      x,
      y,
      ringOffset,
      ringWidth,
    } = getScaledNodeSettings(defaultNodeDrawingSettings, globalScale, node)
    const {
      maxLabelLength,
      mainTextColor,
      secondTextColor,
      nodeRingColor: ringColor,
      textAlign,
      textBaseline,
    } = defaultNodeDrawingSettings
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline
    ctx.fillStyle = mainTextColor // Text color
    const label = node.label as string
    drawCapsuleNode({
      x,
      y,
      radius,
      width,
      height,
      ctx,
      label,
      node,
      maxLabelLength,
      mainTextColor,
      secondTextColor,
    })

    if (node.id === selectedNodeID) {
      drawCapsuleNodeRing({
        x,
        y,
        radius,
        offset: ringOffset,
        ringWidth,
        ringColor,
        ctx,
        width,
        height,
      })
    } else if (node.id === hoverNode) {
      drawCapsuleNodeRing({
        x,
        y,
        radius,
        offset: ringOffset,
        ringWidth,
        ringColor: 'red',
        ctx,
        width,
        height,
      })
    } else if (highlightNodes.has(node.id as string)) {
      drawCapsuleNodeRing({
        x,
        y,
        radius,
        offset: ringOffset,
        ringWidth,
        ringColor: 'lightblue',
        ctx,
        width,
        height,
      })
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="w-[750px] h-[750px] relative">
        <ForceGraph
          width={680}
          height={720}
          initialZoomLevel={2.8}
          onNodeSingleClick={(node) => setSelectedNodeID(node.id as string)}
          data={shownData}
          onNodeDoubleClick={handleDoubleClick}
          ref={forceGraphRef}
          nodeCanvasObject={drawNode}
          onNodeHover={handleNodeHover}
          linkDirectionalParticles={4}
          simpleForceSettings={distantLayoutForce}
          linkDirectionalParticleWidth={(link) => (highlightLinks.has(link.id) ? 4 : 0)}
          linkCanvasObject={(link, ctx, globalScale) => {
            drawLinkWithLabel({ link, ctx, globalScale })
          }}
          FooterNoteComponent={() => (
            <div>
              <b>Última actualización</b>: 15-03-24 10:35
            </div>
          )}
        />
        <CategoryFilter setCategoryFilter={setCategoryFilter} />
      </div>
      <div className="flex-grow border-l-2">{selectedNode && <InfoCard node={selectedNode} />}</div>
    </div>
  )
}

export default Graph
