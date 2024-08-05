import { Buttons } from './Buttons'
import { Content } from './Content'
import { ContentTopbar } from './ContentTopbar'
import { Example1 } from './Examples/Example1'
import { Resizable } from './Resizable'
import { Sidebar } from './Sidebar'
import { UserSection } from './UserSection'

const SeisveinteLayout = {} as {
  Content: typeof Content
  ContentTopbar: typeof ContentTopbar
  Resizable: typeof Resizable
  UserSection: typeof UserSection
  Buttons: typeof Buttons
  Sidebar: typeof Sidebar
  Examples: {
    Example1: typeof Example1
  }
}

SeisveinteLayout.Content = Content
SeisveinteLayout.ContentTopbar = ContentTopbar
SeisveinteLayout.Resizable = Resizable
SeisveinteLayout.UserSection = UserSection
SeisveinteLayout.Buttons = Buttons
SeisveinteLayout.Sidebar = Sidebar
SeisveinteLayout.Examples = {
  Example1,
}

export { SeisveinteLayout }
