import { ContentTopbarProps } from './types'

export function ContentTopbar({ children }: ContentTopbarProps) {
  return <div className="flex h-12 items-center">{children}</div>
}
