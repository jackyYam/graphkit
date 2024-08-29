import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import MainGraph from './main'
import QuickStart from './QuickStart'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>Not found</div>,
    children: [
      {
        path: '',
        element: <QuickStart />,
      },
      {
        path: 'page1',
        element: <div>hola</div>,
      },
      {
        path: 'page2',
        element: <div>hola</div>,
      },
      {
        path: 'page3',
        element: <MainGraph />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
