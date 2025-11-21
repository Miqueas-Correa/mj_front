import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e3b80", // tu primary-blue
    },
    secondary: {
      main: "#3f497f", // tu secondary-blue
    },
    info: {
      main: "#004a90b6", // hover-blue
    },
    background: {
      default: "#fffffc", // fondo
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;