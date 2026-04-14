import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

import App from './App.jsx'
const PUBLISHABLE_KEY = "pk_test_bGVuaWVudC1tdXN0YW5nLTU3LmNsZXJrLmFjY291bnRzLmRldiQ" 

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
       <App />
    </ClerkProvider>
   
  </StrictMode>,
)
