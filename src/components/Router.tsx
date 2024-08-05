import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Unholster App</div>,
    errorElement: <div>Not found</div>,
  },
  {
    path: 'page1',
    element: <div>Page1</div>,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
