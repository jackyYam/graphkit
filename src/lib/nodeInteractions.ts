import { useState, useCallback } from 'react'
import { NodeObject, LinkObject } from 'react-force-graph-2d'

const useNodeHighlight = () => {
  const [highlightNodes, setHighlightNodes] = useState<Set<NodeObject>>(new Set())
  const [highlightLinks, setHighlightLinks] = useState<Set<LinkObject>>(new Set())
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null)

  const updateHighlight = useCallback(() => {
    setHighlightNodes(new Set(highlightNodes))
    setHighlightLinks(new Set(highlightLinks))
  }, [highlightNodes, highlightLinks])

  const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
      highlightNodes.clear()
      highlightLinks.clear()
      if (node) {
        highlightNodes.add(node)
        node.neighbors.forEach((neighbor: NodeObject) => highlightNodes.add(neighbor))
        node.links.forEach((link: LinkObject) => highlightLinks.add(link))
      }

      setHoverNode(node || null)
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
