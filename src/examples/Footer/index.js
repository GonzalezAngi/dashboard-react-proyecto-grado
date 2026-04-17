/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props

// @mui material components

// Material Dashboard 2 React components

// Material Dashboard 2 React base styles

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      sx={{ background: "#1761a0", borderRadius: "0 0 16px 16px" }}
    >
      <img
        src={require("assets/images/medihome.png")}
        alt="MediHome logo"
        style={{ height: 32, marginRight: 12 }}
      />
      <Typography variant="h6" color="#fff" fontWeight="bold">
        MediHome
      </Typography>
    </Box>
  );
}

export default Footer;
