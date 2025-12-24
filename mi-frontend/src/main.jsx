import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './contexts/AuthProvider';
import { CartProvider } from './contexts/CartProvider';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>

);