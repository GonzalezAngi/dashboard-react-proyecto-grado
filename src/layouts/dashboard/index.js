import React, { useEffect, useMemo, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Componente de estadísticas
import StatisticsCards from "./components/Statistics/StatisticsCards.js";

const neighborhoods = [
  { name: "Centro", count: 50 },
  { name: "Norte", count: 35 },
  { name: "Sur", count: 20 },
];

const monthlyUsers = [
  { month: "Enero", count: 12 },
  { month: "Febrero", count: 16 },
  { month: "Marzo", count: 18 },
  { month: "Abril", count: 24 },
  { month: "Mayo", count: 20 },
  { month: "Junio", count: 28 },
  { month: "Julio", count: 30 },
  { month: "Agosto", count: 34 },
  { month: "Septiembre", count: 26 },
  { month: "Octubre", count: 32 },
  { month: "Noviembre", count: 36 },
  { month: "Diciembre", count: 40 },
];

const appointmentsPerMonth = [
  { month: "Enero", count: 120 },
  { month: "Febrero", count: 135 },
  { month: "Marzo", count: 142 },
  { month: "Abril", count: 160 },
  { month: "Mayo", count: 148 },
  { month: "Junio", count: 170 },
  { month: "Julio", count: 176 },
  { month: "Agosto", count: 185 },
  { month: "Septiembre", count: 172 },
  { month: "Octubre", count: 190 },
  { month: "Noviembre", count: 205 },
  { month: "Diciembre", count: 212 },
];

const ages = [
  { range: "0-18", count: 40 },
  { range: "19-35", count: 90 },
  { range: "36-60", count: 60 },
  { range: "61+", count: 20 },
];

const consultationReasons = [
  { name: "Control general", count: 58 },
  { name: "Dolor de cabeza", count: 41 },
  { name: "Fiebre", count: 36 },
  { name: "Chequeo anual", count: 32 },
  { name: "Dolor estomacal", count: 27 },
];

const consultationTypes = [
  { name: "Presencial", count: 220 },
  { name: "Virtual", count: 80 },
  { name: "Urgencia", count: 40 },
];

const diseases = [
  { name: "Gripe", count: 25 },
  { name: "Diabetes", count: 15 },
  { name: "Hipertensión", count: 20 },
  { name: "Alergias", count: 10 },
];

function Dashboard() {
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesError, setSpecialtiesError] = useState("");

  const apiBaseUrl = useMemo(() => process.env.REACT_APP_API_URL || "", []);

  useEffect(() => {
    const fetchTopSpecialties = async () => {
      try {
        setSpecialtiesError("");
        const response = await fetch(`${apiBaseUrl}/especialidad/v1/mas-solicitadas`);

        if (!response.ok) {
          throw new Error(`No se pudo consultar especialidades (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((item) => ({
                name: item?.nombre || "Sin nombre",
                count: Number(item?.cantidadSolicitudes) || 0,
              }))
              .filter((item) => item.name)
          : [];

        setSpecialties(normalized);
      } catch (error) {
        setSpecialties([]);
        setSpecialtiesError(error?.message || "Error al cargar especialidades.");
      }
    };

    fetchTopSpecialties();
  }, [apiBaseUrl]);

  useEffect(() => {
    window.__MEDIHOME_EXPORT_DATA__ = {
      specialties,
      neighborhoods,
      monthlyUsers,
      ages,
      diseases,
      appointmentsPerMonth,
      consultationReasons,
      consultationTypes,
    };

    return () => {
      window.__MEDIHOME_EXPORT_DATA__ = null;
    };
  }, [specialties]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={2}>
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold">
              Dashboard
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Analitica general de la plataforma MediHome
            </MDTypography>
            {specialtiesError ? (
              <MDTypography variant="button" color="error" fontWeight="regular" mt={1}>
                {specialtiesError}
              </MDTypography>
            ) : null}
          </MDBox>
        </MDBox>

        <MDBox data-dashboard-export-area="true">
          <StatisticsCards
            specialties={specialties}
            neighborhoods={neighborhoods}
            monthlyUsers={monthlyUsers}
            ages={ages}
            appointmentsPerMonth={appointmentsPerMonth}
            consultationReasons={consultationReasons}
            consultationTypes={consultationTypes}
            diseases={diseases}
          />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
