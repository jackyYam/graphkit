import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Graph from './Graph'
import { MyDiagram } from './Regraph'
import ForceGraph from './ForceGraph'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>Not found</div>,
    children: [
      {
        path: '',
        element: <Graph />,
      },
      {
        path: 'page1',
        element: <MyDiagram />,
      },
      {
        path: 'page2',
        element: <MyDiagram />,
      },
      {
        path: 'page3',
        element: <ForceGraph />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
