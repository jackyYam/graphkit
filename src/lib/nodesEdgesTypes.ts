import type { NodeObject, LinkObject } from 'react-force-graph-2d'
export type NodeCategories = {
  [key: string]: {
    es: string
    color: string
    secondColor: string
    [key: string]: string
  }
}
export type CategoryKeys = keyof NodeCategories

export type CustomNodeObject<NodeData> = NodeObject & {
  category: CategoryKeys
  label: string
  // This is the size of the node, 15 seems to be a good size
  val: number
  color: string
  secondColor: string
  data: NodeData
}

export type CustomLinkObject = LinkObject & {
  label?: string
}

export type ForceGraphInputType<NodeData> = {
  nodes: CustomNodeObject<NodeData>[]
  links: CustomLinkObject[]
}
