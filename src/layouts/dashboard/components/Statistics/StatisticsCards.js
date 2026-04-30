import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Icons
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import TableChartIcon from "@mui/icons-material/TableChart";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut, Line, Pie, Radar } from "react-chartjs-2";

import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const barValueLabelsPlugin = {
  id: "barValueLabelsPlugin",
  afterDatasetsDraw(chart, args, options) {
    const { ctx, chartArea } = chart;
    const isHorizontal = chart.options?.indexAxis === "y";

    ctx.save();
    ctx.font = "600 11px Roboto, Helvetica, Arial, sans-serif";
    ctx.fillStyle = options?.color || "#1f2937";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== "bar" || meta.hidden) {
        return;
      }

      meta.data.forEach((element, index) => {
        const value = dataset.data?.[index];
        if (value === null || value === undefined || value === "" || Number(value) <= 0) {
          return;
        }

        const position = element.tooltipPosition();
        const text = String(value);
        const textWidth = ctx.measureText(text).width;

        if (isHorizontal) {
          const padding = 8;
          const { x, y, base } = element.getProps(["x", "y", "base"], true);
          const labelX = Math.max(x - padding - textWidth / 2, base + textWidth / 2 + 4);
          const labelY = y;
          ctx.fillText(text, labelX, labelY);
          return;
        }

        const { x, y } = element.getProps(["x", "y"], true);
        const labelY = y + 12;
        const labelX = x;
        ctx.fillText(text, labelX, labelY);
      });
    });

    ctx.restore();
  },
};

const doughnutValueLabelsPlugin = {
  id: "doughnutValueLabelsPlugin",
  afterDatasetsDraw(chart, args, options) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || !meta.data) return;

      meta.data.forEach((element, index) => {
        // only draw for arc elements (pie/doughnut)
        if (typeof element.circumference === "undefined") return;

        const value = dataset.data?.[index];
        if (value === null || value === undefined || String(value) === "") return;

        const position = element.tooltipPosition();

        ctx.save();
        ctx.fillStyle = (options && options.color) || "#1f2937";
        const fontSize = (options && options.fontSize) || 12;
        const fontWeight = (options && options.fontWeight) || 600;
        ctx.font = `${fontWeight} ${fontSize}px Roboto, Helvetica, Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(value), position.x, position.y);
        ctx.restore();
      });
    });
  },
};
const CARD_THEMES = {
  specialties: { top: "#2b6cb0", bottom: "#edf5ff", border: "rgba(43, 108, 176, 0.18)" },
  neighborhoods: { top: "#2c7a7b", bottom: "#eefaf9", border: "rgba(44, 122, 123, 0.18)" },
  monthlyUsers: { top: "#3182ce", bottom: "#eef7ff", border: "rgba(49, 130, 206, 0.18)" },
  appointmentsPerMonth: {
    top: "#4f7cac",
    bottom: "#eff5fb",
    border: "rgba(79, 124, 172, 0.18)",
  },
  ages: { top: "#d69e2e", bottom: "#fffaf0", border: "rgba(214, 158, 46, 0.22)" },
  consultationReasons: {
    top: "#4a5568",
    bottom: "#f4f7fb",
    border: "rgba(74, 85, 104, 0.18)",
  },
  consultationTypes: { top: "#319795", bottom: "#ecfbfa", border: "rgba(49, 151, 149, 0.18)" },
  diseases: { top: "#667eea", bottom: "#f2f5ff", border: "rgba(102, 126, 234, 0.18)" },
};

function ChartCard({
  title,
  subtitle,
  filePrefix,
  sheetName,
  exportRows,
  children,
  toneKey,
  span,
  minHeight,
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const cardRef = useRef(null);
  const theme = CARD_THEMES[toneKey];

  const closeMenu = () => setMenuAnchorEl(null);

  const exportAsJpg = async () => {
    closeMenu();
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      ignoreElements: (element) => element?.dataset?.exportControl === "true",
    });

    const link = document.createElement("a");
    link.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const exportAsExcel = () => {
    closeMenu();
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <Card
      ref={cardRef}
      sx={{
        gridColumn: { xs: "span 1", md: `span ${span}` },
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${theme.border}`,
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 22px 44px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <MDBox
        sx={{
          px: 3,
          py: 2,
          background: `linear-gradient(135deg, ${theme.top} 0%, ${theme.bottom} 100%)`,
        }}
      >
        <MDBox position="relative" pr={4}>
          <MDTypography variant="h6" color="white" sx={{ fontWeight: 700 }}>
            {title}
          </MDTypography>
          {subtitle ? (
            <MDTypography variant="button" color="white" sx={{ opacity: 0.88, fontWeight: 500 }}>
              {subtitle}
            </MDTypography>
          ) : null}
          <IconButton
            size="small"
            data-export-control="true"
            onClick={(event) => setMenuAnchorEl(event.currentTarget)}
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              backgroundColor: "rgba(255,255,255,0.18)",
              color: "white",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.28)",
              },
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
            <MenuItem onClick={exportAsJpg}>
              <ListItemIcon>
                <ImageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Exportar JPG</ListItemText>
            </MenuItem>
            <MenuItem onClick={exportAsExcel}>
              <ListItemIcon>
                <TableChartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Exportar Excel</ListItemText>
            </MenuItem>
          </Menu>
        </MDBox>
      </MDBox>
      <MDBox
        sx={{
          p: 3,
          minHeight: 290,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)",
          minHeight: minHeight,
        }}
      >
        {children}
      </MDBox>
    </Card>
  );
}

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  filePrefix: PropTypes.string.isRequired,
  sheetName: PropTypes.string.isRequired,
  exportRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  toneKey: PropTypes.oneOf(Object.keys(CARD_THEMES)).isRequired,
  span: PropTypes.number,
  minHeight: PropTypes.number,
  children: PropTypes.node.isRequired,
};

function StatisticsCards({
  specialties,
  neighborhoods,
  monthlyUsers,
  appointmentsPerMonth,
  consultationReasons,
  consultationTypes,
  ages,
  diseases,
}) {
  const appointmentsChartData = useMemo(() => {
    const monthLabels = [
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

    const normalizedRows = appointmentsPerMonth
      .map((row) => {
        const monthIndex = Number(row?.monthIndex) || 0;
        if (monthIndex < 1 || monthIndex > 12) return null;

        const month = monthLabels[monthIndex - 1];
        const year = String(row?.year || "Sin año");
        const count = Number(row?.count) || 0;

        return {
          year,
          month,
          monthIndex,
          count,
        };
      })
      .filter(Boolean);

    const years = Array.from(new Set(normalizedRows.map((row) => row.year))).sort((a, b) => {
      const asNumberA = Number(a);
      const asNumberB = Number(b);

      if (!Number.isNaN(asNumberA) && !Number.isNaN(asNumberB)) {
        return asNumberA - asNumberB;
      }

      return a.localeCompare(b);
    });

    const palette = ["#12b5ad", "#3f4d56", "#4f7cac", "#2c7a7b"];

    const datasets = years.map((year, index) => ({
      label: year,
      data: monthLabels.map((_, monthOffset) => {
        const monthIndex = monthOffset + 1;
        return normalizedRows
          .filter((row) => row.year === year && row.monthIndex === monthIndex)
          .reduce((sum, row) => sum + row.count, 0);
      }),
      backgroundColor: palette[index % palette.length],
      borderRadius: 4,
      borderSkipped: false,
      barPercentage: 0.88,
      categoryPercentage: 0.72,
      maxBarThickness: 24,
    }));

    const maxCount = datasets.reduce((maxValue, dataset) => {
      const datasetMax = Math.max(...dataset.data, 0);
      return Math.max(maxValue, datasetMax);
    }, 0);

    const exportRows = normalizedRows.map((row) => ({
      year: row.year,
      month: row.month,
      monthIndex: row.monthIndex,
      count: row.count,
    }));

    return {
      labels: monthLabels,
      datasets,
      exportRows,
      maxCount,
    };
  }, [appointmentsPerMonth]);

  return (
    <MDBox display="grid" gridTemplateColumns="repeat(12, minmax(0, 1fr))" gap={2}>
      <ChartCard
        title="Especialidades más solicitadas"
        subtitle="Distribución de atenciones por especialidad"
        filePrefix="especialidades"
        sheetName="Especialidades"
        exportRows={specialties}
        toneKey="specialties"
        span={7}
        minHeight={320}
      >
        <Bar
          data={{
            labels: specialties.map((d) => d.name),
            datasets: [
              {
                label: "Cantidad de citas",
                data: specialties.map((d) => d.count),
                backgroundColor: ["#2b6cb0", "#63b3ed", "#38a169"],
                borderRadius: 10,
                borderSkipped: false,
              },
            ],
          }}
          options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false }}
          plugins={[barValueLabelsPlugin]}
        />
      </ChartCard>

      <ChartCard
        title="Barrios con más citas"
        subtitle="Top barrios con mayor demanda de atención"
        filePrefix="barrios"
        sheetName="Barrios"
        exportRows={neighborhoods}
        toneKey="neighborhoods"
        span={5}
        minHeight={360}
      >
        <Bar
          data={{
            labels: neighborhoods.map((n) => n.name),
            datasets: [
              {
                label: "Citas",
                data: neighborhoods.map((n) => n.count),
                backgroundColor: ["#2b6cb0", "#3182ce", "#4299e1", "#63b3ed", "#2c7a7b"],
                borderColor: "#1f3d66",
                borderWidth: 1,
                borderRadius: 8,
                barThickness: 9,
                maxBarThickness: 9,
                categoryPercentage: 0.62,
                barPercentage: 0.82,
              },
            ],
          }}
          options={{
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                right: 18,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
                grid: {
                  color: "rgba(15, 23, 42, 0.08)",
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          }}
          plugins={[barValueLabelsPlugin]}
        />
      </ChartCard>

      <ChartCard
        title="Usuarios activos por mes"
        subtitle="Tendencia mensual de usuarios en la plataforma"
        filePrefix="usuarios-activos-por-mes"
        sheetName="Usuarios activos por mes"
        exportRows={monthlyUsers}
        toneKey="monthlyUsers"
        span={7}
        minHeight={330}
      >
        <Line
          data={{
            labels: monthlyUsers.map((m) => m.month),
            datasets: [
              {
                label: "Usuarios activos",
                data: monthlyUsers.map((m) => m.count),
                borderColor: "#3182ce",
                backgroundColor: "rgba(49, 130, 206, 0.16)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: "#3182ce",
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </ChartCard>

      <ChartCard
        title="Cantidad de citas por mes y año"
        subtitle="Comparativo mensual entre años"
        filePrefix="citas-por-mes"
        sheetName="Citas por mes"
        exportRows={appointmentsChartData.exportRows}
        toneKey="appointmentsPerMonth"
        span={5}
        minHeight={330}
      >
        <Bar
          data={{
            labels: appointmentsChartData.labels,
            datasets: appointmentsChartData.datasets,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            layout: {
              padding: {
                top: 6,
                right: 10,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: "start",
                labels: {
                  usePointStyle: true,
                  pointStyle: "circle",
                  boxWidth: 10,
                  boxHeight: 10,
                  color: "#4b5563",
                },
                title: {
                  display: true,
                  text: "Año",
                  color: "#4b5563",
                  padding: {
                    right: 12,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = Number(context.parsed?.y || 0);
                    return `${context.dataset.label}: ${value.toLocaleString("es-CO")}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  autoSkip: false,
                  minRotation: 35,
                  maxRotation: 35,
                  color: "#6b7280",
                },
              },
              y: {
                beginAtZero: true,
                grace: "8%",
                ticks: {
                  precision: 0,
                  color: "#6b7280",
                  callback: (value) => {
                    const numericValue = Number(value) || 0;
                    if (appointmentsChartData.maxCount >= 1000) {
                      return `${(numericValue / 1000).toLocaleString("es-CO", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })} mil.`;
                    }

                    return numericValue.toLocaleString("es-CO");
                  },
                },
                grid: {
                  color: "rgba(55, 65, 81, 0.14)",
                },
              },
            },
          }}
          plugins={[barValueLabelsPlugin]}
        />
      </ChartCard>

      <ChartCard
        title="Edad de pacientes"
        subtitle="Rango etario con más solicitudes"
        filePrefix="edad-pacientes"
        sheetName="Edad pacientes"
        exportRows={ages}
        toneKey="ages"
        span={4}
        minHeight={320}
      >
        <Bar
          data={{
            labels: ages.map((a) => a.range),
            datasets: [
              {
                label: "Cantidad de pacientes",
                data: ages.map((a) => a.count),
                backgroundColor: "#d69e2e",
                borderRadius: 10,
                borderSkipped: false,
              },
            ],
          }}
          plugins={[barValueLabelsPlugin]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 0,
                },
              },
            },
          }}
        />
      </ChartCard>

      <ChartCard
        title="Motivos de consulta más frecuentes"
        subtitle="Razones de atención más repetidas"
        filePrefix="motivos-consulta"
        sheetName="Motivos de consulta"
        exportRows={consultationReasons}
        toneKey="consultationReasons"
        span={4}
        minHeight={320}
      >
        <Bar
          data={{
            labels: consultationReasons.map((reason) => reason.name),
            datasets: [
              {
                label: "Consultas",
                data: consultationReasons.map((reason) => reason.count),
                backgroundColor: "#4a5568",
                borderRadius: 10,
                borderSkipped: false,
              },
            ],
          }}
          options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false }}
          plugins={[barValueLabelsPlugin]}
        />
      </ChartCard>

      <ChartCard
        title="Tipo de consulta mas solicitada"
        subtitle="Canal de atencion preferido"
        filePrefix="tipo-consulta"
        sheetName="Tipo de consulta"
        exportRows={consultationTypes}
        toneKey="consultationTypes"
        span={4}
        minHeight={320}
      >
        <Doughnut
          data={{
            labels: consultationTypes.map((type) => type.name),
            datasets: [
              {
                data: consultationTypes.map((type) => type.count),
                backgroundColor: ["#319795", "#63b3ed", "#7f9cf5"],
                borderWidth: 0,
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false, cutout: "60%" }}
          plugins={[doughnutValueLabelsPlugin]}
        />
      </ChartCard>

      <ChartCard
        title="Enfermedades mas registradas"
        subtitle="Motivos clinicos mas comunes"
        filePrefix="enfermedades"
        sheetName="Enfermedades"
        exportRows={diseases}
        toneKey="diseases"
        span={4}
        minHeight={320}
      >
        <Pie
          data={{
            labels: diseases.map((d) => d.name),
            datasets: [
              {
                data: diseases.map((d) => d.count),
                backgroundColor: ["#c85a99", "#f5dbe4", "#e7c9d7", "#f9eef3"],
                borderColor: "#ffffff",
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  usePointStyle: true,
                  boxWidth: 10,
                  boxHeight: 10,
                },
              },
            },
          }}
        />
      </ChartCard>
    </MDBox>
  );
}

StatisticsCards.propTypes = {
  specialties: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  neighborhoods: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  monthlyUsers: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  appointmentsPerMonth: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      month: PropTypes.string.isRequired,
      monthIndex: PropTypes.number,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  consultationReasons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  consultationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  ages: PropTypes.arrayOf(
    PropTypes.shape({
      range: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  diseases: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StatisticsCards;
