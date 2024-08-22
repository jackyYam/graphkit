import { SeisveinteLayout } from '@/components/seisveinte/SeisveinteLayout'
import { UnholsterLogo } from '@/components/seisveinte/UnholsterLogo'

const BUTTONS = [
  {
    label: 'Button 1',
    onClick: () => console.log('/page1'),
    routes: ['/', '/page1'],
    isCurrentPage: true,
  },
  {
    label: 'Button 2',
    onClick: () => console.log('/page2'),
    routes: ['/page2'],
    isCurrentPage: false,
  },
  {
    label: 'Button 3',
    onClick: () => console.log('/page3'),
    routes: ['/page3'],
    isCurrentPage: false,
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

export function Example1() {
  return (
    <div className="h-[500px] w-full">
      <SeisveinteLayout.Resizable>
        <SeisveinteLayout.Sidebar>
          <SeisveinteLayout.UserSection personMenu={PERSON} orgMenu={ORG} />
          <SeisveinteLayout.Buttons buttons={BUTTONS} />
          <div className="flex w-full justify-center">
            <UnholsterLogo />
          </div>
        </SeisveinteLayout.Sidebar>
        <div className="flex w-full flex-col h-screen">
          <SeisveinteLayout.ContentTopbar />
          <SeisveinteLayout.Content>Content</SeisveinteLayout.Content>
        </div>
      </SeisveinteLayout.Resizable>
    </div>
  )
}
