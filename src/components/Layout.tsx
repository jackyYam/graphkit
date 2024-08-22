import { SeisveinteLayout } from '@/components/seisveinte/SeisveinteLayout'
import { UnholsterLogo } from '@/components/seisveinte/UnholsterLogo'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const BUTTONS = [
  {
    label: 'Button 1',
    routes: ['/', '/page1'],
  },
  {
    label: 'Button 2',
    routes: ['/page2'],
  },
  {
    label: 'Button 3',
    routes: ['/page3'],
  },
]

const PERSON = {
  name: 'Nombre largo de una persona',
  photo: {
    fallback: 'UN',
  },
  actions: [
    {
      label: 'Item 1',
      onClick: () => console.log('Item 1'),
    },
    {
      label: 'Item 2',
      onClick: () => console.log('Item 2'),
    },
  ],
}
const ORG = {
  name: 'Nombre largo de una organización',
  photo: {
    fallback: 'ON',
  },
  actions: [
    {
      label: 'Item 1',
      onClick: () => console.log('Item 1'),
    },
  ],
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const buttons = BUTTONS.map((button) => {
    const isCurrentPage = button.routes.includes(location.pathname)
    const onClick = () => {
      navigate(button.routes[0])
    }
    return {
      ...button,
      isCurrentPage,
      onClick,
    }
  })

  return (
    <SeisveinteLayout.Resizable>
      <SeisveinteLayout.Sidebar>
        <SeisveinteLayout.UserSection personMenu={PERSON} orgMenu={ORG} />
        <SeisveinteLayout.Buttons buttons={buttons} />
        <div className="flex w-full justify-center">
          <UnholsterLogo />
        </div>
      </SeisveinteLayout.Sidebar>
      <div className="flex w-full flex-col h-screen">
        <SeisveinteLayout.ContentTopbar />
        <SeisveinteLayout.Content>
          <Outlet />
        </SeisveinteLayout.Content>
      </div>
    </SeisveinteLayout.Resizable>
  )
}
