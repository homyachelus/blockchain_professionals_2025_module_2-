import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.tsx'
import {MyProvider} from "./redux/context.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MyProvider>
          <App />
      </MyProvider>
  </StrictMode>,
)
