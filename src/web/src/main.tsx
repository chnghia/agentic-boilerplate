import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/geist-sans';
import "@fontsource/geist-sans/300.css";
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/functional/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={200}>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
