import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../components/Navbar";
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}
          >
            MJ STORE
          </Typography>

          {/* BUSCADOR */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: 1,
              px: 1,
              flexGrow: 1,
              maxWidth: 400,
            }}
          >
            <InputBase placeholder="Buscar..." sx={{ ml: 1, flex: 1 }} />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
          <Navbar />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}