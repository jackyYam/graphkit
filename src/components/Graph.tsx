import Dagre from '@dagrejs/dagre'
import React, { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react'
import { Button } from './ui/button'
import { initialNodes, initialEdges } from './nodesEdgesTypes'
import '@xyflow/react/dist/style.css'
import type { Node, Edge } from '@xyflow/react'
import CustomNode from './CustomNode'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const nodeTypes = {
  custom: CustomNode,
}

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: string }
): { nodes: Node[]; edges: Edge[] } => {
  const g = new Dagre.graphlib.Graph({ multigraph: true }).setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: options.direction })

  edges.forEach((edge) => g.setEdge(edge.source, edge.target))
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  )

  Dagre.layout(g)

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id)
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2
      const y = position.y - (node.measured?.height ?? 0) / 2

      return { ...node, position: { x, y } }
    }),
    edges,
  }
}

const LayoutFlow = () => {
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, { direction })

      setNodes([...layouted.nodes])
      setEdges([...layouted.edges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges, fitView, setNodes, setEdges]
  )

  useEffect(() => {
    onLayout('LR')
  }, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={(event, node) => console.log('click', node)}
      fitView
    >
      <Panel position="top-right">
        <Button onClick={() => onLayout('TB')}>vertical layout</Button>
        <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent onInteractOutside={(e) => e.preventDefault()}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Panel>
      <Panel position="bottom-left">
        <div className="h-8 w-[500px] rounded-[32px] shadow-md border border-[#F2F2F2] bg-white"></div>
      </Panel>
    </ReactFlow>
  )
}

export default function () {
  return (
    <div className="w-[1000px] h-[700px]">
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  )
}
