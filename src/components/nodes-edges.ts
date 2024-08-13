import type { Node, Edge } from '@xyflow/react'
export const categories = {
  people: {
    es: 'Persona',
    color: '#27AE60',
  },
  document: {
    es: 'Documento',
    color: '#333333',
  },
  place: {
    es: 'Lugar',
    color: '#2F80ED',
  },
  event: {
    es: 'Evento',
    color: '#F2C94C',
  },
  organization: {
    es: 'Organización',
    color: '#FE7300',
  },
}
type Category = keyof typeof categories
interface CustomNode extends Node {
  data: {
    label: string
    category: Category
  }
}
export const initialNodes: CustomNode[] = [
  {
    id: 'main',
    type: 'custom',
    data: { label: 'Alberto Armador', category: 'people' },
    position: { x: 0, y: 50 },
  },
  {
    id: 'd1',
    type: 'custom',
    data: { label: 'Doc 1', category: 'document' },
    position: { x: 0, y: 100 },
  },
  {
    id: 'd2',
    type: 'custom',
    data: { label: 'Doc 2', category: 'document' },
    position: { x: 0, y: 100 },
  },
  {
    id: 'd3',
    type: 'custom',
    data: { label: 'Doc 3', category: 'document' },
    position: { x: 0, y: 100 },
  },
  {
    id: 'p1',
    type: 'custom',
    data: { label: 'Persona 1', category: 'people' },
    position: { x: 0, y: 200 },
  },
  {
    id: 'p2',
    type: 'custom',
    data: { label: 'Persona 2', category: 'people' },
    position: { x: 0, y: 200 },
  },
  {
    id: 'p3',
    type: 'custom',
    data: { label: 'Persona 3', category: 'people' },
    position: { x: 0, y: 200 },
  },
  {
    id: 'l1',
    type: 'custom',
    data: { label: 'Lugar 1', category: 'place' },
    position: { x: 0, y: 300 },
  },
  {
    id: 'l2',
    type: 'custom',
    data: { label: 'Lugar 2', category: 'place' },
    position: { x: 0, y: 300 },
  },
  {
    id: 'o1',
    type: 'custom',
    data: { label: 'Organizacion 1', category: 'organization' },
    position: { x: 0, y: 400 },
  },
  {
    id: 'e1',
    type: 'custom',
    data: { label: 'Evento tortura', category: 'event' },
    position: { x: 0, y: 500 },
  },
]

export const initialEdges: Edge[] = [
  { id: 'maind3', source: 'main', target: 'd3', animated: false },
  { id: 'maind2', source: 'main', target: 'd2', animated: false },
  { id: 'maind1', source: 'main', target: 'd1', animated: false },
  { id: 'p1d3', source: 'p1', target: 'd3', animated: false },
  { id: 'p2d3', source: 'p2', target: 'd3', animated: false },
  { id: 'l1d3', source: 'l1', target: 'd3', animated: false },
  { id: 'e1l1', source: 'e1', target: 'l1', animated: false },
  { id: 'e1p1', source: 'e1', target: 'p1', animated: false },
  { id: 'o1d1', source: 'o1', target: 'd1', animated: false },
  { id: 'l2d1', source: 'l2', target: 'd1', animated: false },
  { id: 'l2d2', source: 'l2', target: 'd2', animated: false },
  { id: 'p3d2', source: 'p3', target: 'd2', animated: false },
]

export function hexToRgba(hex: string, alpha: number): string {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const forceGraphData = {
  nodes: initialNodes.map((node) => ({
    id: node.id,
    name: node.data.label,
    val: Math.random() * (20 - 1) + 1,
    category: node.data.category,
    isMain: node.id === 'main',
    color: categories[node.data.category].color,
    secondColor: hexToRgba(categories[node.data.category].color, 0.6),
  })),
  links: initialEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    distance: 100,
    label: 'Mencionado',
  })),
}
