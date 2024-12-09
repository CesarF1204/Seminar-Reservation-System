import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from "./contexts/AppContext.jsx";
import LoadingFallback from './components/LoadingFallback.jsx';

/* Create a new QueryClient instance */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, /* Disable retry on failed queries */
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
