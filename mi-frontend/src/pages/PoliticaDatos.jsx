import { Box, Typography, Paper } from "@mui/material";

export default function PoliticaDatos() {
  return (
    <Box sx={{ maxWidth: 700, margin: "80px auto", padding: 2 }}>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom component="h1">
          Uso de Datos Personales
        </Typography>

        <Typography component="p" sx={{ mb: 2 }}>
          La información personal proporcionada (nombre, email, teléfono) será utilizada exclusivamente 
          para mejorar la comunicación entre la tienda y el usuario.
        </Typography>

        <Typography component="p" sx={{ mb: 2 }}>
          Cada vez que se realice un pedido, el personal de la tienda recibirá estos datos para 
          contactarse vía WhatsApp o correo electrónico con el fin de:
        </Typography>

        <Typography component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>Confirmar la compra</li>
          <li>Enviar el comprobante y el detalle del pedido</li>
          <li>Informar sobre cualquier inconveniente o actualización</li>
          <li>Garantizar una correcta entrega y atención al cliente</li>
        </Typography>

        <Typography component="p">
          Los datos no serán compartidos con terceros y se procesan de acuerdo con nuestra política de privacidad.
        </Typography>
      </Paper>
    </Box>
  );
}