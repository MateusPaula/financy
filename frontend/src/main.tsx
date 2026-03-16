import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { Toaster } from 'sonner'
import { client } from './lib/graphql/apollo'
import './index.css'
import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
      <Toaster position="top-right" richColors />
    </ApolloProvider>
  </StrictMode>,
)
