import { Button } from '@/components/ui/button'
import { ButtonsProps } from './types'

export function Buttons({ buttons = [] }: ButtonsProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {buttons.map((button, index) => {
        return (
          <Button
            onClick={button.onClick}
            variant={button.isCurrentPage ? 'secondary' : 'ghost'}
            className={`p-ui w-full justify-start ${button.isCurrentPage ? 'bg-primary hover:bg-primary-dark text-white' : ''}`}
            key={index}
          >
            {button.label}
          </Button>
        )
      })}
    </div>
  )
}
