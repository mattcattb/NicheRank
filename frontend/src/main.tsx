import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/Theme.tsx';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
