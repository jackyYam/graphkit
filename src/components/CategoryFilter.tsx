import React from 'react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { useGeneralSettingsStore } from '@/stores/graphstore'

interface CategoryFilterProps {
  setCategoryFilter: (v: string[]) => void
}
const CategoryFilter = ({ setCategoryFilter }: CategoryFilterProps) => {
  const categories = useGeneralSettingsStore((state) => state.categories)
  return (
    <div className="px-3 h-9 absolute top-1 left-1/2 transform -translate-x-1/2 bg-white rounded-[36px] shadow-legend">
      <ToggleGroup
        type="multiple"
        onValueChange={(v: string[]) => {
          setCategoryFilter(v)
        }}
      >
        {Object.entries(categories).map(([categoryKey, categoryValue]) => (
          <ToggleGroupItem
            key={categoryKey}
            className="flex space-x-2 items-center"
            value={categoryKey}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryValue.color }}
            ></div>
            <p className="text-[11px]">{categoryValue.es}</p>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default CategoryFilter
