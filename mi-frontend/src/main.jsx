import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);