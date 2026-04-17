/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1600&q=80",
    title: "Cuidamos a nuestros pacientes con atencion cercana y humana",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=1600&q=80",
    title: "Acompanamos a los adultos mayores en cada paso de su proceso medico",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
    title: "Ayudamos a reducir el estres de las largas esperas en centros de salud",
  },
  {
    image:
      "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1600&q=80",
    title: "Optimizamos la gestion de citas para una atencion mas rapida y organizada",
  },
];

function Header() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const goToPrevious = () => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goToNext = () => setActiveSlide((prev) => (prev + 1) % slides.length);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        position="relative"
        width="100%"
        maxWidth="980px"
        mx="auto"
        sx={{ overflow: "visible" }}
      >
        <MDBox
          borderRadius="xl"
          sx={{
            height: { xs: "230px", md: "420px" },
            backgroundImage: `url(${currentSlide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
            boxShadow: "0 14px 35px rgba(15, 23, 42, 0.2)",
          }}
        />

        <MDBox position="absolute" top={0} left={0} right={0} bottom={0} pointerEvents="none">
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: "-14px", md: "-22px" },
              transform: "translateY(-50%)",
              color: "#1e3a8a",
              backgroundColor: "white",
              border: "1px solid #bfdbfe",
              boxShadow: "0 8px 18px rgba(30, 58, 138, 0.2)",
              pointerEvents: "auto",
              "&:hover": { backgroundColor: "#eff6ff" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: "-14px", md: "-22px" },
              transform: "translateY(-50%)",
              color: "#1e3a8a",
              backgroundColor: "white",
              border: "1px solid #bfdbfe",
              boxShadow: "0 8px 18px rgba(30, 58, 138, 0.2)",
              pointerEvents: "auto",
              "&:hover": { backgroundColor: "#eff6ff" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </MDBox>
      </MDBox>

      <MDBox maxWidth="980px" mx="auto" mt={2} px={{ xs: 1, md: 0 }}>
        <MDBox
          sx={{
            backgroundColor: "white",
            border: "1px solid #dbe5f4",
            borderRadius: "14px",
            px: { xs: 1.25, md: 2 },
            py: { xs: 1.2, md: 1.4 },
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          }}
        >
          <MDTypography
            variant="h5"
            color="dark"
            fontWeight="bold"
            textAlign="center"
            sx={{ lineHeight: 1.3, fontSize: { xs: "1rem", md: "1.3rem" } }}
          >
            {currentSlide.title}
          </MDTypography>

          <MDBox mt={1.2} display="flex" justifyContent="center" gap={0.75}>
            {slides.map((slide, index) => (
              <MDBox
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                sx={{
                  width: activeSlide === index ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: activeSlide === index ? "#1976d2" : "#b6d2f7",
                  cursor: "pointer",
                  transition: "all 220ms ease",
                }}
              />
            ))}
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Header;
