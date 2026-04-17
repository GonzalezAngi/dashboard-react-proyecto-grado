/**
=========================================================
* MediHome - Login Screen
=========================================================
*/

import { useEffect, useState } from "react";

// react-router-dom
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// MediHome components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import PageLayout from "examples/LayoutContainers/PageLayout";

// Auth helpers
import { saveSession, isAuthenticated } from "utils/auth";

// Logo
import medihomeLogo from "assets/images/medihome.png";

function SignIn() {
  const navigate = useNavigate();

  const [identificacion, setIdentificacion] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT || "/auth/login";

  const normalizeLoginResponse = (payload) => {
    const token = payload?.token || payload?.accessToken || payload?.jwt;
    const user = payload?.user || payload?.data?.user || null;

    return { token, user };
  };

  const parseErrorMessage = async (response) => {
    try {
      const body = await response.json();
      const reason = body?.message || body?.error || body?.detail;
      return reason ? `Error ${response.status}: ${reason}` : `Error ${response.status}.`;
    } catch (parseError) {
      return `Error ${response.status}.`;
    }
  };

  const performLoginRequest = async (credentials) => {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      throw new Error(message);
    }

    return response.json();
  };

  const handleLogin = async () => {
    setError("");

    if (!identificacion || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const payload = await performLoginRequest({
        identificacion: identificacion.trim(),
        contrasena: password,
      });
      const { token, user } = normalizeLoginResponse(payload);

      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación.");
      }

      saveSession({ token, user });
      navigate("/dashboard");
    } catch (requestError) {
      if (requestError?.message === "Failed to fetch") {
        setError("No hay conexión con el backend en http://localhost:8080.");
      } else {
        setError(requestError.message || "No se pudo iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <PageLayout background="light">
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, #1A73E8 0%, #0d47a1 100%)",
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "420px" },
            p: 0,
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          {/* Header con gradiente */}
          <MDBox
            sx={{
              background: "linear-gradient(135deg, #1A73E8 0%, #0d47a1 100%)",
              py: 4,
              px: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MDBox
              component="img"
              src={medihomeLogo}
              alt="MediHome Logo"
              sx={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                mb: 1.5,
                filter: "brightness(0) invert(1)",
              }}
            />
            <MDTypography
              variant="h4"
              fontWeight="bold"
              color="white"
              textAlign="center"
              sx={{ lineHeight: 1.2 }}
            >
              MediHome
            </MDTypography>
            <MDTypography
              variant="body2"
              color="white"
              textAlign="center"
              sx={{ opacity: 0.85, mt: 0.5 }}
            >
              Bienvenido, inicia sesión para continuar
            </MDTypography>
          </MDBox>

          {/* Formulario */}
          <MDBox px={4} py={4}>
            {/* Mensaje de error */}
            {error && (
              <MDBox
                mb={2}
                p={1.5}
                sx={{
                  backgroundColor: "#fdecea",
                  borderRadius: "8px",
                  border: "1px solid #f44336",
                }}
              >
                <MDTypography variant="caption" color="error" fontWeight="medium">
                  {error}
                </MDTypography>
              </MDBox>
            )}

            {/* Campo identificacion */}
            <MDBox mb={3}>
              <MDTypography
                variant="caption"
                fontWeight="bold"
                color="text"
                mb={0.5}
                display="block"
              >
                IDENTIFICACION
              </MDTypography>
              <MDInput
                type="text"
                placeholder="12345678"
                fullWidth
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </MDBox>

            {/* Campo contraseña */}
            <MDBox mb={4}>
              <MDTypography
                variant="caption"
                fontWeight="bold"
                color="text"
                mb={0.5}
                display="block"
              >
                CONTRASEÑA
              </MDTypography>
              <MDInput
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            {/* Botón de login */}
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: "bold",
                letterSpacing: "0.5px",
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "INICIAR SESIÓN"}
            </MDButton>

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="caption" color="secondary">
                Inicia con identificacion y contrasena
              </MDTypography>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </PageLayout>
  );
}

export default SignIn;
