import { create } from 'zustand'
import { ForceGraphInputType } from '@/components/nodesEdgesTypes'
import { NodeCategories } from '@/components/nodesEdgesTypes'

export type simpleGraohForceSettings = {
  linkDistance: number
  linkStrength: number
  chargeStrength: number
}

export interface GraphDataState<NodeData> {
  data: ForceGraphInputType<NodeData>
  setData: (data: ForceGraphInputType<NodeData>) => void
}

export const useGraphDataStore = <NodeData>() =>
  create<GraphDataState<NodeData>>()((set) => ({
    data: { nodes: [], links: [] },
    setData: (data) => set({ data }),
  }))

export interface GeneralSettingsState {
  categories: NodeCategories
  setCategories: (categories: NodeCategories) => void
}
export const useGeneralSettingsStore = create<GeneralSettingsState>((set) => ({
  categories: {},
  setCategories: (categories) => set({ categories }),
}))
