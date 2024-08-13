import React from 'react'
import { GraphCanvas } from 'reagraph'

const nodes = [
  {
    id: '1',
    label: '1',
  },
  {
    id: '2',
    label: '2',
  },
]

const edges = [
  {
    source: '1',
    target: '2',
    id: '1-2',
    label: '1-2',
  },
  {
    source: '2',
    target: '1',
    id: '2-1',
    label: '2-1',
  },
]

export const MyDiagram = () => (
  <div className="relative w-[1000px] h-[700px]">
    <GraphCanvas
      nodes={nodes}
      edges={edges}
      renderNode={({ size, color, opacity, node }) => (
        <group>
          <mesh>
            <torusKnotGeometry attach="geometry" args={[size, 1.25, 50, 8]} />
            <meshBasicMaterial attach="material" color={color} opacity={opacity} transparent />
          </mesh>
        </group>
      )}
    />
  </div>
)
