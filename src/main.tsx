import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import ExperiencePage from './pages/ExperiencePage.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'
import ContactPage from './pages/ContactPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root>
      <RouterProvider router={router} />
    </ReactLenis>
  </StrictMode>,
)
