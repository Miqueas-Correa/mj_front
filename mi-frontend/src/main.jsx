import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/theme";

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Resetea margenes y aplica fondo */}
    <App />
  </ThemeProvider>
)
