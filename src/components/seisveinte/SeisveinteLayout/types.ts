export interface ButtonProps {
  label: string
  onClick: () => void
  routes: string[]
  isCurrentPage: boolean
}

export type Buttons = ButtonProps[]
export interface ButtonsProps {
  buttons?: Buttons
}

export interface SeisveinteLayoutProps {
  buttons?: Buttons
}

export interface ContentTopbarProps {
  children?: React.ReactNode
}

export interface ContentProps {
  children?: React.ReactNode
}

export interface UserSectionProps {
  personMenu: {
    name: string
    photo: {
      src?: string
      fallback?: string
    }
    actions: {
      label: string
      onClick?: () => void
    }[]
  }
  orgMenu: {
    name: string
    photo: {
      src?: string
      fallback?: string
    }
    actions: {
      label: string
      onClick?: () => void
    }[]
  }
}
