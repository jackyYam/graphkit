import type { NodeObject, LinkObject } from 'react-force-graph-2d'
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

type CustomNodeObject = NodeObject & {
  category: Category
}

export const initialNodes: CustomNodeObject[] = [
  {
    id: 'main',
    type: 'custom',
    data: { label: 'Alberto Armador' },
    position: { x: 0, y: 50 },
    category: 'people',
  },
  {
    id: 'd1',
    type: 'custom',
    data: { label: 'Doc 1' },
    category: 'document',
    position: { x: 0, y: 100 },
  },
  {
    id: 'd2',
    type: 'custom',
    data: { label: 'Doc 2' },
    position: { x: 0, y: 100 },
    category: 'document',
  },
  {
    id: 'd3',
    type: 'custom',
    data: { label: 'Doc 3' },
    position: { x: 0, y: 100 },
    category: 'document',
  },
  {
    id: 'p1',
    type: 'custom',
    data: { label: 'Persona 1' },
    position: { x: 0, y: 200 },
    category: 'people',
  },
  {
    id: 'p2',
    type: 'custom',
    data: { label: 'Persona 2' },
    position: { x: 0, y: 200 },
    category: 'people',
  },
  {
    id: 'p3',
    type: 'custom',
    data: { label: 'Persona 3' },
    position: { x: 0, y: 200 },
    category: 'people',
  },
  {
    id: 'l1',
    type: 'custom',
    data: { label: 'Lugar 1' },
    position: { x: 0, y: 300 },
    category: 'place',
  },
  {
    id: 'l2',
    type: 'custom',
    data: { label: 'Lugar 2' },
    position: { x: 0, y: 300 },
    category: 'place',
  },
  {
    id: 'o1',
    type: 'custom',
    data: { label: 'Organizacion 1' },
    position: { x: 0, y: 400 },
    category: 'organization',
  },
  {
    id: 'e1',
    type: 'custom',
    data: { label: 'Evento tortura' },
    position: { x: 0, y: 500 },
    category: 'event',
  },
]

export const initialEdges: LinkObject[] = [
  { id: 'maind3', source: 'main', target: 'd3' },
  { id: 'maind2', source: 'main', target: 'd2' },
  { id: 'maind1', source: 'main', target: 'd1' },
  { id: 'p1d3', source: 'p1', target: 'd3' },
  { id: 'p2d3', source: 'p2', target: 'd3' },
  { id: 'l1d3', source: 'l1', target: 'd3' },
  { id: 'e1l1', source: 'e1', target: 'l1' },
  { id: 'e1p1', source: 'e1', target: 'p1' },
  { id: 'o1d1', source: 'o1', target: 'd1' },
  { id: 'l2d1', source: 'l2', target: 'd1' },
  { id: 'l2d2', source: 'l2', target: 'd2' },
  { id: 'p3d2', source: 'p3', target: 'd2' },
]

export function hexToRgba(hex: string, alpha: number): string {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const forceGraphData: {
  nodes: NodeObject[]
  links: LinkObject[]
} = {
  nodes: initialNodes.map((node) => ({
    id: node.id,
    name: node.data.label,
    val: 15,
    category: node.data.category,
    isMain: node.id === 'main',
    color: categories[node.category].color,
    secondColor: hexToRgba(categories[node.category].color, 0.6),
  })),
  links: initialEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    distance: 100,
    label: 'Mencionado',
  })),
}

forceGraphData.links.forEach((link) => {
  const a = forceGraphData.nodes.find((n) => n.id === link.source)
  const b = forceGraphData.nodes.find((n) => n.id === link.target)
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

export { forceGraphData }
