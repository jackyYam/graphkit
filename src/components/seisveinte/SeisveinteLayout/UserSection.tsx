import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserSectionProps } from './types'

export function UserSection({ personMenu, orgMenu }: UserSectionProps) {
  return (
    <div className="flex h-12 w-full items-center justify-between gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={orgMenu.photo.src}></AvatarImage>
              <AvatarFallback>{orgMenu.photo.fallback || ''}</AvatarFallback>
            </Avatar>
            <p className="p-ui line-clamp-2 text-left text-xs">{orgMenu.name}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{orgMenu.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          {personMenu.actions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{personMenu.photo.fallback}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{personMenu.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {personMenu.actions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
