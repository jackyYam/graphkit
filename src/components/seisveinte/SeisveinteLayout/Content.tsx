import { ContentProps } from './types'

export function Content({ children }: ContentProps) {
  return (
    <div className="flex w-full flex-col p-4 py-2">
      <section className="overflow-y-auto md:max-w-[640px] xl:max-w-[1100px]">{children}</section>
    </div>
  )
}
