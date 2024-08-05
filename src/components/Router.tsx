import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>Not found</div>,
    children: [
      {
        path: '',
        element: <div>Page 1</div>,
      },
      {
        path: 'page1',
        element: <div>Page 1</div>,
      },
      {
        path: 'page2',
        element: <div>Page 2</div>,
      },
      {
        path: 'page3',
        element: <div>Page 3</div>,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
