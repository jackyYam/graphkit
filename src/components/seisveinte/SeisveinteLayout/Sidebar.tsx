import styled from 'styled-components'

export interface SidebarProps {
  children: React.ReactNode
  className?: string
}

export const Sidebar = styled.div.attrs(({ className }) => ({
  className: `h-full justify-between ${className}`,
}))`
  display: grid;
  grid: min-content 1fr min-content / 1fr;
` as React.FC<SidebarProps>
