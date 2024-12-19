//packages/client/src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExerciseSessionProvider } from './contexts/ExerciseSessionContext'
import { ExerciseProvider } from './contexts/ExerciseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExerciseSessionProvider>
      <ExerciseProvider>
        <App />
      </ExerciseProvider>
    </ExerciseSessionProvider>
  </StrictMode>,
)
