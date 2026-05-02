import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// Project components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import { getToken } from "utils/auth";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    usuarioId: null,
    nombre: "",
    telefono: "",
    email: "",
    identificacion: "",
    genero: "",
    estado: "",
    tipo_identificacion: "",
    contrasena: "",
    tipo_usuario: "",
    direccion: "",
  });

  function openEditor(original) {
    setForm({
      usuarioId: original.usuarioId || null,
      nombre: original.nombre || "",
      telefono: original.telefono || "",
      email: original.email || "",
      identificacion: original.identificacion || "",
      genero: original.genero || "",
      estado: original.estado || "",
      tipo_identificacion: original.tipo_identificacion || "",
      contrasena: "",
      tipo_usuario: original.tipo_usuario || "",
      direccion: original.direccion || "",
    });
    setEditingId(original.id || null);
  }

  useEffect(() => {
    const load = async () => {
      try {
        const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;

        const resp = await fetch(`${apiBase}/medico/v1/get`, { headers });
        if (resp.ok) {
          const data = await resp.json();
          setMedicos(Array.isArray(data) ? data : []);
        } else {
          console.error("Error cargando médicos", resp.status);
          setMedicos([]);
        }
      } catch (e) {
        console.error(e);
        setMedicos([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Teléfono", accessor: "telefono" },
    { Header: "Email", accessor: "email" },
    { Header: "Identificación", accessor: "identificacion" },
    { Header: "Especialidad", accessor: "especialidad" },
    {
      Header: "Calificación",
      accessor: "calificacion",
      Cell: StarCell,
    },
    { Header: "Valor consulta", accessor: "valor_consulta" },
    { Header: "Tarjeta profesional", accessor: "tarjetaProfe" },
    { Header: "Estado", accessor: "estado" },
    {
      Header: "Acciones",
      accessor: "actions",
      align: "right",
      Cell: ActionCell,
    },
  ];

  function StarCell({ value }) {
    const val = value != null ? Number(value) : 0;
    const score = Math.min(5, Math.max(0, Math.round(val)));
    return (
      <span>
        {Array.from({ length: 5 }).map((_, i) =>
          i < score ? (
            <StarIcon key={i} sx={{ color: "#FFD700" }} fontSize="small" />
          ) : (
            <StarBorderIcon key={i} fontSize="small" />
          )
        )}
      </span>
    );
  }

  StarCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  function ActionCell({ row }) {
    return (
      <MDButton size="small" color="info" onClick={() => openEditor(row.original)}>
        Editar
      </MDButton>
    );
  }

  ActionCell.propTypes = {
    row: PropTypes.shape({ original: PropTypes.object.isRequired }).isRequired,
  };

  const rows = medicos.map((m) => ({
    nombre: m.usuario?.nombre || "-",
    telefono: m.usuario?.telefono || m.telefono || "-",
    email: m.usuario?.email || m.email || "-",
    identificacion: m.usuario?.identificacion || m.identificacion || "-",
    especialidad: m.especialidad?.nombre || (m.especialidad ? String(m.especialidad) : "-"),
    calificacion: m.calificacion != null ? m.calificacion : 0,
    valor_consulta: m.valor_consulta || "-",
    tarjetaProfe: m.tarjetaProfe || "-",
    estado: m.estado || "-",
    id: m.id,
    usuarioId: m.usuario?.id || null,
  }));

  const table = { columns, rows };

  return (
    <MDBox py={3} sx={{ pl: { lg: "300px" }, boxSizing: "border-box" }}>
      <MDBox display="flex" justifyContent="center">
        <Card sx={{ width: "100%", maxWidth: 1200, borderRadius: 3 }}>
          <Dialog
            open={Boolean(editingId)}
            onClose={() => setEditingId(null)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Editar médico</DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="dense"
                label="Nombre"
                fullWidth
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Teléfono"
                fullWidth
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Identificación"
                fullWidth
                value={form.identificacion}
                onChange={(e) => setForm({ ...form, identificacion: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Estado"
                fullWidth
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <MDButton color="secondary" onClick={() => setEditingId(null)}>
                Cancelar
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={async () => {
                  try {
                    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080";
                    const payload = {
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
                    const headers = { "Content-Type": "application/json" };
                    const token = getToken();
                    if (token) headers.Authorization = `Bearer ${token}`;
                    const resp = await fetch(`${apiBase}/user/v1/update`, {
                      method: "PUT",
                      headers,
                      body: JSON.stringify(payload),
                    });
                    if (!resp.ok) {
                      const txt = await resp.text();
                      alert(`Error ${resp.status}: ${txt}`);
                      return;
                    }
                    alert("Usuario actualizado");
                    setEditingId(null);
                  } catch (e) {
                    console.error(e);
                    alert("Error al actualizar");
                  }
                }}
              >
                Guardar
              </MDButton>
            </DialogActions>
          </Dialog>
          <MDBox display="flex" justifyContent="center" alignItems="center" p={2}>
            <MDBox flexGrow={1} textAlign="center">
              <MDTypography variant="h6" sx={{ fontWeight: 700, mt: 4 }}>
                Catálogo de Médicos
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox p={2}>
            <MDBox mb={2} display="flex" justifyContent={{ xs: "center", md: "flex-end" }}>
              {/* keep search near table controls: DataTable already shows search; this keeps Refresh visually aligned */}
            </MDBox>
            <DataTable
              table={table}
              entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15] }}
              canSearch
              showTotalEntries
              pagination={{ variant: "contained", color: "info" }}
              noEndBorder={false}
              isSorted
            />
          </MDBox>
        </Card>
      </MDBox>
    </MDBox>
  );
}
