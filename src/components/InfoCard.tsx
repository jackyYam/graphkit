import { categories } from '@/lib/exmapleData'
import { TestCategory as Category } from '@/lib/exmapleData'
import type { NodeObject } from 'react-force-graph-2d'

interface InfoCardProps {
  node: NodeObject
}

const InforCardTitle = ({ node }: InfoCardProps) => {
  return (
    <div>
      <div
        className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: node.color }}
      >
        {categories[node.category as Category].es}
      </div>
      <h2 className="text-lg font-bold underline underline-offset-1 text-[#333333] mt-1">
        {node.name}
      </h2>
    </div>
  )
}
interface InfoCardSectionProps {
  title: string
  data: {
    [key: string]: string
  }
}
const InfoCardSection = ({ title, data }: InfoCardSectionProps) => {
  return (
    <div className="mt-5">
      <h3 className="font-bold text-sm mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs text-[#828282] first-letter:capitalize">{key}</p>
            <p className="text-sm font-normal mt-1 first-letter:capitalize">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const InfoCard = ({ node }: InfoCardProps) => {
  return (
    <div className="w-full h-full p-5 pr-1">
      <InforCardTitle node={node} />
      <InfoCardSection title="Datos plataforma" data={node.data['platform']} />
      <InfoCardSection title="Datos SDDHH" data={node.data['sddhh']} />
    </div>
  )
}

export default InfoCard
