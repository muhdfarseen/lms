import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { LMSProvider } from "@/hooks/use-lms-store.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LMSProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </LMSProvider>
    </ThemeProvider>
  </StrictMode>,
)
