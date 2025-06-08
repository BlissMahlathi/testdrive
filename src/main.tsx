
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import EnvCheck from './components/system/EnvCheck.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <>
        <EnvCheck />
        <App />
      </>
    </ThemeProvider>
  </StrictMode>
);
