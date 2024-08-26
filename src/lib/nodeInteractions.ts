import { useState, useCallback } from 'react'
import { NodeObject, LinkObject } from 'react-force-graph-2d'

const useNodeHighlight = () => {
  const [highlightNodes, setHighlightNodes] = useState<Set<string | number>>(new Set())
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set())
  const [hoverNode, setHoverNode] = useState<string | number | null>(null)

  const updateHighlight = useCallback(() => {
    setHighlightNodes(new Set(highlightNodes))
    setHighlightLinks(new Set(highlightLinks))
  }, [highlightNodes, highlightLinks])

  const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
      highlightNodes.clear()
      highlightLinks.clear()
      if (node) {
        highlightNodes.add(node.id as string)
        node.neighbors.forEach((neighbor: NodeObject) => highlightNodes.add(neighbor.id as string))
        node.links.forEach((link: LinkObject) => highlightLinks.add(link.id as string))
      }

      setHoverNode(node?.id || null)
      updateHighlight()
    },
    [highlightNodes, highlightLinks, updateHighlight]
  )

  return {
    highlightNodes,
    highlightLinks,
    hoverNode,
    handleNodeHover,
  }
}

export default useNodeHighlight
