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

import { useState, useEffect } from "react";

// react-router components
import { useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar, setOpenConfigurator } from "context";
import { clearSession, getCurrentUser, getToken } from "utils/auth";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [controller, dispatch] = useMaterialUIController();
  const { transparentNavbar, fixedNavbar, darkMode, openConfigurator } = controller;
  const currentUser = getCurrentUser();
  const userType =
    currentUser?.tipoUsuario ||
    currentUser?.tipo_usuario ||
    currentUser?.tipoDeUsuario ||
    currentUser?.userType ||
    currentUser?.role ||
    currentUser?.rol ||
    "Tipo de usuario";

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    usuarioId: null,
    nombre: "",
    telefono: "",
    email: "",
    identificacion: "",
    genero: "",
    estado: "activo",
    tipo_identificacion: "",
    contrasena: "",
    tipo_usuario: "",
    direccion: "",
  });
  const handleEditProfile = async () => {
    handleCloseUserMenu();
    setEditOpen(true);

    try {
      // Load medicos without JWT (no Authorization header)
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const medicosResp = await fetch(`${apiBase}/medico/v1/get`);

      const medicos = medicosResp.ok ? await medicosResp.json() : [];

      const currentUser = getCurrentUser();
      let myMedico = null;
      for (const m of medicos) {
        if (m && m.usuario && String(m.usuario.id) === String(currentUser?.id)) {
          myMedico = m;
          break;
        }
      }
      if (myMedico) {
        setForm({
          usuarioId: myMedico.usuario?.id || null,
          nombre: myMedico.usuario?.nombre || "",
          telefono: myMedico.usuario?.telefono || "",
          email: myMedico.usuario?.email || "",
          identificacion: myMedico.usuario?.identificacion || "",
          genero: myMedico.usuario?.genero || "",
          estado: myMedico.usuario?.estado || "activo",
          tipo_identificacion: myMedico.usuario?.tipo_identificacion || "",
          contrasena: "",
          tipo_usuario: myMedico.usuario?.tipo_usuario || "",
          direccion: myMedico.usuario?.direccion || "",
        });
      } else if (currentUser) {
        setForm((f) => ({
          ...f,
          usuarioId: currentUser?.id || null,
          nombre: currentUser?.nombre || "",
          telefono: currentUser?.telefono || "",
          email: currentUser?.email || "",
          identificacion: currentUser?.identificacion || "",
          genero: currentUser?.genero || "",
          estado: currentUser?.estado || "activo",
          tipo_identificacion: currentUser?.tipo_identificacion || "",
          tipo_usuario: currentUser?.tipo_usuario || "",
          direccion: currentUser?.direccion || "",
        }));
      }
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar datos del perfil");
    }
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm("¿Estás segura de que deseas cerrar sesión?");
    if (!shouldLogout) {
      return;
    }

    clearSession();
    navigate("/authentication/sign-in", { replace: true });
  };

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox sx={{ flexGrow: 1 }} />
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center" gap={0.5}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <Tooltip title="Cerrar sesión">
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    ...navbarIconButton,
                    color: ({ palette: { error } }) => error.main,
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                ml={1}
                lineHeight={1}
                sx={{ minWidth: 88 }}
              >
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={{ ...navbarIconButton, p: 0.25 }}
                  onClick={handleOpenUserMenu}
                >
                  <AccountCircleIcon sx={{ color: "#2f86c7", fontSize: 30 }} />
                </IconButton>
                <MDTypography
                  variant="caption"
                  color="inherit"
                  textAlign="center"
                  sx={{ mt: 0.1, fontWeight: 700, maxWidth: 110, lineHeight: 1.1 }}
                >
                  {userType}
                </MDTypography>
              </MDBox>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleEditProfile}>Editar perfil</MenuItem>
              </Menu>
              <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Editar perfil (Usuario)</DialogTitle>
                <DialogContent dividers>
                  <TextField
                    margin="dense"
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Identificación"
                    name="identificacion"
                    value={form.identificacion}
                    onChange={(e) => setForm({ ...form, identificacion: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Género"
                    name="genero"
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Tipo identificación"
                    name="tipo_identificacion"
                    value={form.tipo_identificacion}
                    onChange={(e) => setForm({ ...form, tipo_identificacion: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Tipo usuario"
                    name="tipo_usuario"
                    value={form.tipo_usuario}
                    onChange={(e) => setForm({ ...form, tipo_usuario: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Estado"
                    name="estado"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Contraseña (dejar vacío si no cambia)"
                    name="contrasena"
                    type="password"
                    value={form.contrasena}
                    onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <MDBox sx={{ mr: 1 }}>
                    <MDButton color="secondary" onClick={() => setEditOpen(false)}>
                      Cancelar
                    </MDButton>
                  </MDBox>
                  <MDBox sx={{ mr: 1 }}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={async () => {
                        try {
                          const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080";
                          const usuarioPayload = {
                            id: Number(form.usuarioId) || null,
                            nombre: form.nombre,
                            telefono: form.telefono,
                            email: form.email,
                            identificacion: form.identificacion,
                            genero: form.genero,
                            estado: form.estado,
                            tipo_identificacion: form.tipo_identificacion,
                            contrasena: form.contrasena || null,
                            tipo_usuario: form.tipo_usuario,
                            direccion: form.direccion,
                          };

                          if (!form.usuarioId) {
                            alert("No se puede actualizar: usuario no identificado");
                            return;
                          }

                          console.debug("usuarioPayload:", usuarioPayload);
                          const headers = { "Content-Type": "application/json" };
                          const token = getToken();
                          if (token) headers.Authorization = `Bearer ${token}`;

                          const respUser = await fetch(`${apiBase}/user/v1/update`, {
                            method: "PUT",
                            headers,
                            body: JSON.stringify(usuarioPayload),
                          });

                          if (!respUser.ok) {
                            let bodyText = "";
                            try {
                              const text = await respUser.text();
                              bodyText = text || "(sin cuerpo)";
                            } catch (e) {
                              bodyText = "(no se pudo leer el cuerpo de la respuesta)";
                            }
                            const msg = `Error ${respUser.status}: ${bodyText}`;
                            console.error(msg);
                            alert(msg);
                            return;
                          }
                          alert("Usuario actualizado");
                          setEditOpen(false);
                        } catch (err) {
                          console.error(err);
                          alert("No se pudo actualizar el usuario. Revisa la consola.");
                        }
                      }}
                    >
                      Guardar
                    </MDButton>
                  </MDBox>
                </DialogActions>
              </Dialog>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
