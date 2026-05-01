import React, { useEffect, useMemo, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { getToken } from "utils/auth";

// Componente de estadisticas
import StatisticsCards from "./components/Statistics/StatisticsCards.js";

const MAX_NEIGHBORHOODS = 8;
const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const cleanNeighborhoodName = (rawValue) => {
  if (!rawValue) return "Sin barrio";

  let value = String(rawValue).trim().replace(/\s+/g, " ");

  // Drop noisy query fragments and keep a short human-friendly label.
  if (value.includes("?")) value = value.split("?")[0];
  if (value.includes(",")) value = value.split(",")[0];
  if (value.length > 24) value = `${value.slice(0, 21)}...`;

  return value || "Sin barrio";
};

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

const ages = [
  { range: "0-18", count: 40 },
  { range: "19-35", count: 90 },
  { range: "36-60", count: 60 },
  { range: "61+", count: 20 },
];

const DEFAULT_CONSULTATION_REASONS = [
  { name: "Control general", count: 58 },
  { name: "Dolor de cabeza", count: 41 },
  { name: "Fiebre", count: 36 },
  { name: "Chequeo anual", count: 32 },
  { name: "Dolor estomacal", count: 27 },
];

const DEFAULT_DISEASES = [
  { name: "Gripe", count: 25 },
  { name: "Diabetes", count: 15 },
  { name: "Hipertension", count: 20 },
  { name: "Alergias", count: 10 },
];

function Dashboard() {
  const pickFirstNonEmpty = (obj, keys) => {
    if (!obj) return null;
    for (const k of keys) {
      const v = obj[k];
      if (v !== null && v !== undefined && String(v).trim() !== "") return v;
    }
    return null;
  };
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesError, setSpecialtiesError] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [neighborhoodsError, setNeighborhoodsError] = useState("");
  const [appointmentsPerMonth, setAppointmentsPerMonth] = useState([]);
  const [appointmentsPerMonthError, setAppointmentsPerMonthError] = useState("");
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [consultationTypesError, setConsultationTypesError] = useState("");
  const [consultationReasons, setConsultationReasons] = useState(DEFAULT_CONSULTATION_REASONS);
  const [consultationReasonsError, setConsultationReasonsError] = useState("");
  const [diseases, setDiseases] = useState(DEFAULT_DISEASES);
  const [diseasesError, setDiseasesError] = useState("");

  const apiBaseUrl = useMemo(() => process.env.REACT_APP_API_URL || "http://localhost:8080", []);

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
    const fetchTopNeighborhoods = async () => {
      try {
        setNeighborhoodsError("");
        const response = await fetch(`${apiBaseUrl}/cita/v1/barrios-mas-solicitados`);

        if (!response.ok) {
          throw new Error(`No se pudo consultar barrios (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((item) => ({
                name: cleanNeighborhoodName(item?.barrio),
                count: Number(item?.cantidadSolicitudes) || 0,
              }))
              .filter((item) => item.name)
          : [];

        const groupedByNeighborhood = normalized.reduce((acc, item) => {
          const key = item.name.toLowerCase();
          const previous = acc.get(key);

          if (previous) {
            previous.count += item.count;
          } else {
            acc.set(key, { ...item });
          }

          return acc;
        }, new Map());

        const sortedNeighborhoods = Array.from(groupedByNeighborhood.values())
          .filter((item) => item.count > 0)
          .sort((a, b) => b.count - a.count);

        let chartNeighborhoods = sortedNeighborhoods;
        if (sortedNeighborhoods.length > MAX_NEIGHBORHOODS) {
          const top = sortedNeighborhoods.slice(0, MAX_NEIGHBORHOODS);
          const othersCount = sortedNeighborhoods
            .slice(MAX_NEIGHBORHOODS)
            .reduce((sum, item) => sum + item.count, 0);

          chartNeighborhoods = [...top, { name: "Otros", count: othersCount }];
        }

        setNeighborhoods(chartNeighborhoods);
      } catch (error) {
        setNeighborhoods([]);
        setNeighborhoodsError(error?.message || "Error al cargar barrios.");
      }
    };

    fetchTopNeighborhoods();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchConsultationTypes = async () => {
      try {
        setConsultationTypesError("");
        const response = await fetch(`${apiBaseUrl}/cita/v1/tipos-cita-mas-solicitados`);

        if (!response.ok) {
          throw new Error(`No se pudo consultar tipos de cita (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((item) => ({
                name:
                  pickFirstNonEmpty(item, [
                    "tipoConsulta",
                    "tipo_consulta",
                    "tipo",
                    "nombre",
                  ]) || "Sin tipo",
                count: Number(item?.cantidad ?? item?.cantidadSolicitudes ?? item?.count) || 0,
              }))
              .filter((item) => item.name)
          : [];

        setConsultationTypes(normalized);
      } catch (error) {
        setConsultationTypes([]);
        setConsultationTypesError(error?.message || "Error al cargar tipos de consulta.");
      }
    };

    fetchConsultationTypes();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchConsultationReasons = async () => {
      try {
        setConsultationReasonsError("");
        const response = await fetch(`${apiBaseUrl}/cita/v1/motivos-consulta-mas-frecuentes`);

        if (!response.ok) {
          throw new Error(`No se pudo consultar motivos (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((item) => ({
                name:
                  pickFirstNonEmpty(item, [
                    "tipoConsulta",
                    "tipo_consulta",
                    "motivo",
                    "nombre",
                  ]) || "Sin motivo",
                count: Number(item?.cantidad ?? item?.count ?? item?.cantidadSolicitudes) || 0,
              }))
              .filter((item) => item.name)
          : [];

        if (!normalized || normalized.length === 0) {
          setConsultationReasons(DEFAULT_CONSULTATION_REASONS);
        } else {
          setConsultationReasons(normalized);
        }
      } catch (error) {
        setConsultationReasons(DEFAULT_CONSULTATION_REASONS);
        setConsultationReasonsError(error?.message || "Error al cargar motivos de consulta.");
      }
    };

    fetchConsultationReasons();
  }, [apiBaseUrl]);

  useEffect(() => {
    const normalizeText = (value) =>
      String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const parseDateParts = (value) => {
      if (value === null || value === undefined) return null;

      const raw = String(value).trim();
      if (!raw) return null;

      // dd/MM/yyyy or dd-MM-yyyy (example: 12/04/2025)
      const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s.*)?$/);
      if (dmy) {
        return {
          day: Number(dmy[1]),
          monthIndex: Number(dmy[2]),
          year: Number(dmy[3]),
        };
      }

      // yyyy-MM-dd or yyyy/MM/dd
      const ymd = raw.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[T\s].*)?$/);
      if (ymd) {
        return {
          day: Number(ymd[3]),
          monthIndex: Number(ymd[2]),
          year: Number(ymd[1]),
        };
      }

      return null;
    };

    const parseMonthIndex = (value) => {
      if (value === null || value === undefined) return null;

      if (typeof value === "number" && value >= 1 && value <= 12) {
        return value;
      }

      const dateParts = parseDateParts(value);
      if (dateParts?.monthIndex >= 1 && dateParts.monthIndex <= 12) {
        return dateParts.monthIndex;
      }

      const raw = String(value).trim();
      if (!raw) return null;

      const asNumber = Number(raw);
      if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= 12) {
        return asNumber;
      }

      const normalized = normalizeText(raw);
      const monthIdx = MONTH_LABELS.findIndex((month) => normalizeText(month) === normalized);
      return monthIdx >= 0 ? monthIdx + 1 : null;
    };

    const parseYearValue = (value) => {
      if (value === null || value === undefined) return null;

      if (typeof value === "number") {
        return value >= 1900 && value <= 3000 ? value : null;
      }

      const raw = String(value).trim();
      if (!raw) return null;

      const asNumber = Number(raw);
      if (!Number.isNaN(asNumber) && asNumber >= 1900 && asNumber <= 3000) {
        return asNumber;
      }

      const dateParts = parseDateParts(raw);
      if (dateParts?.year) {
        return dateParts.year;
      }

      return null;
    };

    const normalizeAppointments = (payload) => {
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      let parsedRows = 0;
      const totalsByYearAndMonth = rows.reduce((accumulator, item) => {
        const monthSourceValues = [
          item?.mes,
          item?.month,
          item?.mesNumero,
          item?.monthNumber,
          item?.numeroMes,
          item?.nombreMes,
          item?.fecha,
          item?.fechaCita,
          item?.fechaSolicitud,
          item?.createdAt,
        ];
        const monthIndex = monthSourceValues
          .map((value) => parseMonthIndex(value))
          .find((value) => value !== null && value !== undefined);

        if (!monthIndex) return accumulator;

        const yearSourceValues = [
          item?.anio,
          item?.year,
          item?.ano,
          item?.yearNumber,
          item?.periodo,
          item?.fecha,
          item?.fechaCita,
          item?.fechaSolicitud,
          item?.createdAt,
        ];
        const parsedYear = yearSourceValues
          .map((value) => parseYearValue(value))
          .find((value) => value !== null && value !== undefined);
        const year = parsedYear ? String(parsedYear) : "Sin ano";

        const count = Number(
          item?.cantidadCitas ??
            item?.cantidadSolicitudes ??
            item?.total ??
            item?.count ??
            item?.cantidad
        );

        if (Number.isNaN(count)) return accumulator;

        const key = `${year}-${monthIndex}`;
        const previous = accumulator.get(key);

        if (previous) {
          previous.count += count;
        } else {
          accumulator.set(key, {
            year,
            month: MONTH_LABELS[monthIndex - 1],
            monthIndex,
            count,
          });
        }

        parsedRows += 1;
        return accumulator;
      }, new Map());

      const series = Array.from(totalsByYearAndMonth.values()).sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);

        if (!Number.isNaN(yearA) && !Number.isNaN(yearB) && yearA !== yearB) {
          return yearA - yearB;
        }

        if (a.monthIndex !== b.monthIndex) {
          return a.monthIndex - b.monthIndex;
        }

        return a.month.localeCompare(b.month);
      });

      return {
        rowsCount: rows.length,
        parsedRows,
        series,
      };
    };

    const fetchAppointmentsPerMonth = async () => {
      try {
        setAppointmentsPerMonthError("");
        const token = getToken();
        const requestOptions = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined;

        const endpointCandidates = [
          `${apiBaseUrl}/cita/v1/citas-por-mes`,
          `${apiBaseUrl}/cita/v1/solicitudes-por-mes`,
          `${apiBaseUrl}/cita/v1/solicitudes/mensual`,
        ];

        let lastError = null;
        for (const endpoint of endpointCandidates) {
          try {
            const response = await fetch(endpoint, requestOptions);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const payload = await response.json();
            const normalized = normalizeAppointments(payload);

            // Only accept when at least one row was parsed correctly.
            if (normalized.parsedRows > 0) {
              setAppointmentsPerMonth(normalized.series);
              return;
            }

            lastError = new Error(
              `Sin datos mensuales parseables (filas: ${normalized.rowsCount}, parseadas: ${normalized.parsedRows}).`
            );
          } catch (error) {
            lastError = error;
          }
        }

        throw new Error(
          `No se pudo consultar citas por mes (${lastError?.message || "sin detalle"}).`
        );
      } catch (error) {
        setAppointmentsPerMonth([]);
        setAppointmentsPerMonthError(error?.message || "Error al cargar citas por mes.");
      }
    };

    fetchAppointmentsPerMonth();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setDiseasesError("");
        const response = await fetch(`${apiBaseUrl}/cita/v1/medios-pago-mas-solicitados`);

        if (!response.ok) {
          throw new Error(`No se pudo consultar medios de pago (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((item) => ({
                name:
                  pickFirstNonEmpty(item, [
                    "tipoConsulta",
                    "tipo_consulta",
                    "medio_pago",
                    "medioPago",
                    "nombre",
                  ]) || "Sin medio",
                count: Number(item?.cantidad ?? item?.count ?? item?.cantidadSolicitudes) || 0,
              }))
              .filter((item) => item.name)
          : [];

        if (!normalized || normalized.length === 0) {
          setDiseases(DEFAULT_DISEASES);
        } else {
          setDiseases(normalized);
        }
      } catch (error) {
        setDiseases(DEFAULT_DISEASES);
        setDiseasesError(error?.message || "Error al cargar medios de pago.");
      }
    };

    fetchPaymentMethods();
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
  }, [specialties, neighborhoods, appointmentsPerMonth, diseases, consultationReasons, consultationTypes]);

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
            {neighborhoodsError ? (
              <MDTypography variant="button" color="error" fontWeight="regular" mt={1}>
                {neighborhoodsError}
              </MDTypography>
            ) : null}
            {appointmentsPerMonthError ? (
              <MDTypography variant="button" color="error" fontWeight="regular" mt={1}>
                {appointmentsPerMonthError}
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
