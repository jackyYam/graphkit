import { ContentProps } from './types'

export function Content({ children }: ContentProps) {
  return (
    <div className="flex w-full flex-col p-4 py-2 flex-grow">
      <section className="overflow-y-auto max-h-full h-full">{children}</section>
    </div>
  )
}
