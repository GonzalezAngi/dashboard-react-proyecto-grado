/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
 */

import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import imageone from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM (1).jpeg";
import heroImage from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM.jpeg";
import imageTwo from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM (4).jpeg";
import imageThree from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM (3).jpeg";
import imageFour from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM (2).jpeg";
import imageFive from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.18.01 PM.jpeg";
import imageSix from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.18.01 PM (1).jpeg";
import imageSeven from "assets/images/illustrations/WhatsApp Image 2026-06-24 at 9.15.39 PM (5).jpeg";

const featureCards = [
  {
    title: "Solicitar citas",
    description: "Los pacientes pueden pedir sus citas desde la aplicacion movil.",
    icon: "📅",
    tint: "#dbeafe",
  },
  {
    title: "Gestionar medicos",
    description: "Administra la informacion de los medicos y sus especialidades.",
    icon: "👩‍⚕️",
    tint: "#dcfce7",
  },
  {
    title: "Especialidades",
    description: "Organiza y consulta las especialidades disponibles en la plataforma.",
    icon: "💜",
    tint: "#ede9fe",
  },
  {
    title: "Analitica",
    description: "Visualiza estadisticas y reportes para la toma de decisiones.",
    icon: "📊",
    tint: "#ffedd5",
  },
  {
    title: "Adultos mayores",
    description:
      "Diseñado especialmente para facilitar el acceso a los servicios de salud de los adultos mayores.",
    icon: "👴",
    tint: "#fef3c7",
  },
];

const evidenceImages = [
  heroImage,
  imageone,
  imageTwo,
  imageThree,
  imageFour,
  imageFive,
  imageSix,
  imageSeven,
];

function Header() {
  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        position="relative"
        width="100%"
        maxWidth="980px"
        mx="auto"
        px={{ xs: 1, md: 0 }}
        sx={{ overflow: "visible" }}
      >
        <MDBox
          sx={{
            p: { xs: 1.25, md: 1.5 },
            backgroundColor: "#f8fafc",
            border: "1px solid rgba(148, 163, 184, 0.22)",
            borderRadius: "28px",
            boxShadow: "0 20px 42px rgba(15, 23, 42, 0.08)",
          }}
        >
          <MDBox
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.32fr 0.88fr" },
              gap: { xs: 1.2, md: 1.5 },
              alignItems: "start",
            }}
          >
            <MDBox
              sx={{
                p: { xs: 2, md: 2.5 },
                backgroundColor: "white",
                borderRadius: "24px",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
              }}
            >
              <MDTypography
                variant="h3"
                color="dark"
                fontWeight="bold"
                sx={{
                  lineHeight: 1.05,
                  fontSize: { xs: "1.65rem", sm: "2.05rem", md: "2.7rem" },
                  maxWidth: { xs: "100%", md: "86%" },
                  color: "#1e293b",
                  mb: 1.4,
                }}
              >
                Bienvenido a MediHome 👋
              </MDTypography>

              <MDTypography
                variant="body1"
                sx={{
                  color: "#475569",
                  lineHeight: 1.7,
                  fontSize: { xs: "0.95rem", md: "1.02rem" },
                  maxWidth: { xs: "100%", md: "82%" },
                  mb: 2,
                }}
              >
                Sistema web y movil disenado para facilitar la solicitud de citas medicas para
                adultos mayores, mejorando la accesibilidad y la oportunidad en la atencion.
              </MDTypography>

              <MDBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  gap: 1.1,
                  maxWidth: { xs: "100%", md: "88%" },
                }}
              >
                <MDBox
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                  }}
                >
                  <MDTypography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      mb: 0.3,
                    }}
                  >
                    Objetivo
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: "#0f172a", fontWeight: 700 }}>
                    Atencion mas clara y ordenada
                  </MDTypography>
                </MDBox>

                <MDBox
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                  }}
                >
                  <MDTypography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      mb: 0.3,
                    }}
                  >
                    Enfoque
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: "#0f172a", fontWeight: 700 }}>
                    Proyecto de grado con impacto social
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox
              sx={{
                p: { xs: 2, md: 2.25 },
                backgroundColor: "white",
                borderRadius: "24px",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
              }}
            >
              <MDTypography
                variant="h6"
                fontWeight="bold"
                color="dark"
                sx={{ mb: 1, fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Objetivo del proyecto
              </MDTypography>
              <MDTypography
                variant="body2"
                sx={{
                  color: "#475569",
                  lineHeight: 1.7,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Facilitar el acceso oportuno a servicios medicos generales y especializados para
                adultos mayores, reduciendo barreras y mejorando la experiencia de uso.
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox mt={2.2}>
            <MDTypography
              variant="h6"
              color="dark"
              fontWeight="bold"
              sx={{ mb: 0.5, fontSize: { xs: "1rem", md: "1.1rem" } }}
            >
              ¿Qué puedes hacer en MediHome?
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: "#64748b", mb: 1.5 }}>
              Funciones principales pensadas para acompanamiento, organizacion y seguimiento.
            </MDTypography>

            <MDBox
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
                gap: 1.2,
              }}
            >
              {featureCards.map((card) => (
                <MDBox
                  key={card.title}
                  sx={{
                    p: 1.6,
                    borderRadius: "18px",
                    backgroundColor: "white",
                    border: "1px solid rgba(148, 163, 184, 0.16)",
                    boxShadow: "0 10px 22px rgba(15, 23, 42, 0.06)",
                    minHeight: "172px",
                  }}
                >
                  <MDBox
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "14px",
                      backgroundColor: card.tint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.15rem",
                      mb: 1.1,
                    }}
                  >
                    {card.icon}
                  </MDBox>
                  <MDTypography variant="subtitle2" fontWeight="bold" color="dark" sx={{ mb: 0.7 }}>
                    {card.title}
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: "#475569", lineHeight: 1.55 }}>
                    {card.description}
                  </MDTypography>
                </MDBox>
              ))}
            </MDBox>
          </MDBox>

          <MDBox mt={2.2}>
            <MDBox display="flex" alignItems="center" mb={1.1}>
              <MDBox>
                <MDTypography
                  variant="h6"
                  color="dark"
                  fontWeight="bold"
                  sx={{ mb: 0.35, fontSize: { xs: "1rem", md: "1.1rem" } }}
                >
                  Evidencias fotograficas
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: "#64748b" }}>
                  Trabajo de campo con adultos mayores utilizando la aplicacion.
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 0.5,
              }}
            >
              {evidenceImages.map((src, index) => (
                <MDBox
                  key={`${src}-${index}`}
                  component="img"
                  src={src}
                  alt={`Evidencia fotografica ${index + 1}`}
                  sx={{
                    width: "100%",
                    minHeight: { xs: "62px", md: "74px" },
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    borderRadius: "10px",
                    boxShadow: "0 5px 12px rgba(15, 23, 42, 0.04)",
                    border: "1px solid rgba(255,255,255,0.88)",
                    display: "block",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 22px rgba(15,23,42,0.10)",
                    },
                  }}
                />
              ))}
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Header;
