import { ForceGraphInputType, NodeCategories } from '@/lib/nodesEdgesTypes'
import { LinkObject } from 'react-force-graph-2d'
export const categories: NodeCategories = {
  people: {
    es: 'Persona',
    color: '#27AE60',
    secondColor: '#BEE7CF',
  },
  document: {
    es: 'Documento',
    color: '#333333',
    secondColor: '#C3C3C3',
  },
  place: {
    es: 'Lugar',
    color: '#2F80ED',
    secondColor: '#C0E1F4',
  },
  event: {
    es: 'Evento',
    color: '#F2C94C',
    secondColor: '#FBEFC9',
  },
  organization: {
    es: 'Organización',
    color: '#FE7300',
    secondColor: '#FFD5B3',
  },
}
export type TestCategory = keyof typeof categories
type TestNode = {
  id: string
  type: string
  category: TestCategory
  data: {
    label: string
  }
}
export const initialNodes: TestNode[] = [
  {
    id: 'main',
    type: 'custom',
    category: 'people',
    data: { label: 'Alberto Armador' },
  },
  {
    id: 'd1',
    type: 'custom',
    data: { label: 'Doc 1' },
    category: 'document',
  },
  {
    id: 'd2',
    type: 'custom',
    data: { label: 'Doc 2' },
    category: 'document',
  },
  {
    id: 'd3',
    type: 'custom',
    data: { label: 'Doc 3' },
    category: 'document',
  },
  {
    id: 'p1',
    type: 'custom',
    data: { label: 'Persona 1' },
    category: 'people',
  },
  {
    id: 'p2',
    type: 'custom',
    data: { label: 'Persona 2' },
    category: 'people',
  },
  {
    id: 'p3',
    type: 'custom',
    data: { label: 'Persona 3' },
    category: 'people',
  },
  {
    id: 'l1',
    type: 'custom',
    data: { label: 'Lugar 1' },
    category: 'place',
  },
  {
    id: 'l2',
    type: 'custom',
    data: { label: 'Lugar 2' },
    category: 'place',
  },
  {
    id: 'o1',
    type: 'custom',
    data: { label: 'Organizacion 1' },
    category: 'organization',
  },
  {
    id: 'e1',
    type: 'custom',
    data: { label: 'Evento tortura' },
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

export type NodeData = {
  [key: string]: {
    [key: string]: string
  }
}

export type TestNodeData = {
  platform: {
    [key: string]: string
  }
  sddhh: {
    [key: string]: string
  }
}

const forceGraphData: ForceGraphInputType<TestNodeData> = {
  nodes: initialNodes.map((node) => ({
    id: node.id,
    label: node.data.label,
    val: 15,
    category: node.category,
    isMain: node.id === 'main',
    color: categories[node.category].color,
    secondColor: categories[node.category].secondColor,
    data: {
      platform: {
        apodo: 'Roncho',
        género: 'Masculino',
        rut: '12.345.678-9',
        'fehca de nacimiento': '15-04-1954',
      },
      sddhh: {
        cargo: 'DINA-CNI Brigada Lautaro',
        'fecha ingreso oficio': '20-01-2020',
        organismo: 'Fach',
        dirección: 'San Andrés 1148',
        teléfono: '6444107',
        'organismo agente': 'FACH',
        'fecha registro organismo': '25-04-2007',
        Código: '203944',
        'hoja de vida': 'no',
      },
    },
  })),
  links: initialEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    label: 'Mencionado',
    id: edge.id,
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
