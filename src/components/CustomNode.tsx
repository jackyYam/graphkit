import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { NodeProps } from '@xyflow/react'

export type CustomNodeData = {
  category: 'people' | 'place' | 'organization' | 'event' | 'document'
  label: string
  extra: string
}

export type CustomNodeProps = NodeProps & {
  data: CustomNodeData
}

const nodeBorderColor = {
  people: 'border-[#27AE60]',
  place: 'border-[#2F80ED]',
  organization: 'border-[#FE7300]',
  event: 'border-[#F2C94C]',
  document: 'border-[#333333]',
}
const nodeBgColor = {
  people: '!bg-[#27AE60]',
  place: '!bg-[#2F80ED]',
  organization: '!bg-[#FE7300]',
  event: '!bg-[#F2C94C]',
  document: '!bg-[#333333]',
}

function CustomNode({ data, id }: CustomNodeProps) {
  const isSelected = false
  const isMainNode = false
  return (
    <div
      className={cn(
        `rounded-[34px] border-2 min-w-[92px] h-[35px] px-3 py-1`,
        nodeBorderColor[data.category],
        {
          'border-dotted border-white': !isSelected,
          'border-solid': isSelected,
          [nodeBgColor[data.category]]: !isMainNode,
        }
      )}
    >
      <div className="flex justify-center flex-col items-center h-full">
        <div className="text-[9px]">{data.label}</div>
        {data.extra && <div className="text-gray-500 text-[8px]">{data.extra}</div>}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className={`w-16 ${nodeBgColor[data.category]}`}
      />
      <Handle
        type="source"
        position={Position.Left}
        className={`w-16 ${nodeBgColor[data.category]}`}
      />
      <Handle
        type="source"
        position={Position.Top}
        className={`w-16 ${nodeBgColor[data.category]}`}
      />

      <Handle
        type="target"
        position={Position.Right}
        className={`w-16 ${nodeBgColor[data.category]}`}
      />
    </div>
  )
}

export default memo(CustomNode)
