import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
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
      { path: 'projects/:projectId', element: <ProjectsPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !prefersReducedMotion }}>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ReactLenis>
  </StrictMode>,
)
