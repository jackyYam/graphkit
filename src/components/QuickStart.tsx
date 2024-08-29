import { categories, forceGraphData, TestNodeData } from '@/lib/exmapleData'
import { useGeneralSettingsStore, useSelectedNodeStore } from '@/stores/graphstore'
import { useEffect, useMemo, useState } from 'react'
import { type ForceGraphInputType, CustomNodeObject } from '../lib/nodesEdgesTypes'
import CategoryFilter from './CategoryFilter'
import ForceGraph from './ForceGraph'
import InfoCard from './InfoCard'

const QuickStart = () => {
  const selectedNodeID = useSelectedNodeStore((state) => state.selectedNodeID)
  const [shownData, setShownData] = useState<ForceGraphInputType<TestNodeData>>(forceGraphData)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const setCategories = useGeneralSettingsStore((state) => state.setCategories)

  const selectedNode = useMemo(
    () => forceGraphData.nodes.find((node) => node.id === selectedNodeID),
    [selectedNodeID]
  )

  useEffect(() => {
    setCategories(categories)
  }, [setCategories])

  useEffect(() => {
    if (categoryFilter.length === 0) {
      setShownData(forceGraphData)
    } else {
      const filteredNodes = forceGraphData.nodes.filter(
        (node) => !categoryFilter.includes(node.category as string)
      )
      const filteredLinks = forceGraphData.links.filter(
        (link) =>
          filteredNodes.includes(link.source as CustomNodeObject<TestNodeData>) &&
          filteredNodes.includes(link.target as CustomNodeObject<TestNodeData>)
      )
      setShownData({ nodes: filteredNodes, links: filteredLinks })
    }
  }, [categoryFilter])

  return (
    <div className="flex w-full h-full">
      <div className="w-[750px] h-[750px] relative">
        <ForceGraph data={shownData} />
        <CategoryFilter setCategoryFilter={setCategoryFilter} />
      </div>
      <div className="flex-grow border-l-2">{selectedNode && <InfoCard node={selectedNode} />}</div>
    </div>
  )
}

export default QuickStart
