import { create } from 'zustand'
import { NodeCategories } from '@/lib/nodesEdgesTypes'

export interface GeneralSettingsState {
  categories: NodeCategories
  setCategories: (categories: NodeCategories) => void
}

export interface zoomStore {
  zoomLevel: number
  setZoomLevel: (zoomLevel: number) => void
  adjustZoomLevel: (zoomStep: number) => void
}
export const useZoomStore = create<zoomStore>((set) => ({
  zoomLevel: 2.8,
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  adjustZoomLevel: (zoomStep: number) =>
    set((state) => ({ zoomLevel: state.zoomLevel + zoomStep })),
}))

export const useGeneralSettingsStore = create<GeneralSettingsState>((set) => ({
  categories: {},
  setCategories: (categories) => set({ categories }),
}))

export interface selectedNodeStore {
  selectedNodeID: string | null
  setSelectedNodeID: (id: string | null) => void
}

export const useSelectedNodeStore = create<selectedNodeStore>((set) => ({
  selectedNodeID: null,
  setSelectedNodeID: (id) => set({ selectedNodeID: id }),
}))
