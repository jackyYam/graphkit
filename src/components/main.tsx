import ForceGraph from './ForceGraph'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Plus, Minus } from 'lucide-react'
import { categories } from '@/lib/exmapleData'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { type ForceGraphInputType, CustomNodeObject } from './nodesEdgesTypes'
import { forceGraphData } from '@/lib/exmapleData'
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d'
import InfoCard from './InfoCard'
import { TestNodeData } from '@/lib/exmapleData'
import useNodeHighlight from '@/lib/nodeInteractions'
import {
  drawCapsuleNode,
  drawCapsuleNodeRing,
  defaultNodeDrawingSettings,
  getScaledNodeSettings,
} from '@/lib/drawings'

const Graph = () => {
  const [zoomLevel, setZoomLevel] = useState(2.8)
  const [zoomIntervakId, setZoomIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [selectedNodeID, setSelectedNodeID] = useState<string | null>(null)
  const [data, setData] = useState<ForceGraphInputType<TestNodeData>>(forceGraphData)
  const [shownData, setShownData] = useState<ForceGraphInputType<TestNodeData>>(data)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const forceGraphRef = useRef<ForceGraphMethods>(null)

  const selectedNode = useMemo(
    () => data.nodes.find((node) => node.id === selectedNodeID),
    [data.nodes, selectedNodeID]
  )

  const handleMouseDown = (zoomChange: number) => {
    const id = setInterval(() => {
      setZoomLevel((prev) => prev + zoomChange)
    }, 150) // Adjust the interval time as needed
    setZoomIntervalId(id)
  }
  const getUpdatedTime = () => {
    return new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
  }
  const handleDoubleClick = (node: CustomNodeObject<TestNodeData>) => {
    setData((prev) => {
      const newNodes: CustomNodeObject<TestNodeData>[] = [
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
      return { nodes: [...prev.nodes, ...newNodes], links: [...prev.links, ...newLinks] }
    })
  }

  useEffect(() => {
    if (categoryFilter.length === 0) {
      setShownData(data)
    } else {
      const filteredNodes = data.nodes.filter((node) => !categoryFilter.includes(node.category))
      const filteredLinks = data.links.filter(
        (link) =>
          filteredNodes.includes(link.source as NodeObject) &&
          filteredNodes.includes(link.target as NodeObject)
      )
      setShownData({ nodes: filteredNodes, links: filteredLinks })
    }
  }, [categoryFilter, data])

  const handleMouseUp = () => {
    if (zoomIntervakId) {
      clearInterval(zoomIntervakId)
      setZoomIntervalId(null)
    }
  }

  const drawNode = (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { fontSize, nodeHeight, nodeRadius, nodeWidth, x, y, ringOffest, ringWidth } =
      getScaledNodeSettings(defaultNodeDrawingSettings, globalScale, node)
    const { maxLabelLength, mainTextColor, secondTextColor, nodeRingColor } =
      defaultNodeDrawingSettings
  }
  return (
    <div className="flex w-full h-full">
      <div className="w-[750px] h-full relative">
        <ForceGraph<TestNodeData>
          zoomLevel={zoomLevel}
          selectedNodeID={selectedNodeID}
          onNodeSingleClick={(node) => setSelectedNodeID(node.id)}
          data={shownData}
          onNodeDoubleClick={handleDoubleClick}
          display="spacious"
          ref={forceGraphRef}
        />
        <div className="px-3 h-9 absolute top-1 left-1/2 transform -translate-x-1/2 bg-white rounded-[36px] shadow-legend">
          <ToggleGroup
            type="multiple"
            onValueChange={(v: string[]) => {
              setCategoryFilter(v)
            }}
          >
            {Object.entries(categories).map(([categoryKey, categoryValue]) => (
              <ToggleGroupItem
                key={categoryKey}
                className="flex space-x-2 items-center"
                value={categoryKey}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryValue.color }}
                ></div>
                <p className="text-[11px]">{categoryValue.es}</p>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="absolute bottom-2 left-0 flex justify-between w-full items-center px-3">
          <div className="flex space-x-2">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onMouseDown={() => handleMouseDown(0.5)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setZoomLevel((prev) => prev + 0.5)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onMouseDown={() => handleMouseDown(-0.5)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setZoomLevel((prev) => prev - 0.5)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[12px]">
            <b>Última actualización: </b> {getUpdatedTime()}
          </p>
        </div>
      </div>
      <div className="flex-grow border-l-2">{selectedNode && <InfoCard node={selectedNode} />}</div>
    </div>
  )
}

export default Graph
