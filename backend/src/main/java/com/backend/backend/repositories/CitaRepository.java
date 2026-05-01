package com.backend.backend.repositories;

import com.backend.backend.DTO.BarrioCitaCount;
import com.backend.backend.DTO.CitaMesCount;
import com.backend.backend.DTO.CitaMesCountProjection;
import com.backend.backend.DTO.CitaTipoCount;
import com.backend.backend.DTO.MedioPagoCount;
import com.backend.backend.models.Cita;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface CitaRepository extends CrudRepository<Cita, Integer> {
    ArrayList<Cita> findCitaByMedico_Id(Integer medicoId);

    ArrayList<Cita> findCitaByUsuario_Id(Integer usuarioId);

    @Query("""
        SELECT new com.backend.backend.DTO.BarrioCitaCount(
            TRIM(c.direccion),
            COUNT(c.id)
        )
        FROM Cita c
        WHERE c.direccion IS NOT NULL
          AND TRIM(c.direccion) <> ''
        GROUP BY TRIM(c.direccion)
        ORDER BY COUNT(c.id) DESC
        """)
    List<BarrioCitaCount> obtenerBarriosMasSolicitados();

    @Query(value = """
        SELECT YEAR(fecha_registro) AS anio, MONTH(fecha_registro) AS mes, COUNT(id) AS cantidad
        FROM citas
        WHERE fecha_registro IS NOT NULL AND (:anio IS NULL OR YEAR(fecha_registro) = :anio)
        GROUP BY YEAR(fecha_registro), MONTH(fecha_registro)
        ORDER BY YEAR(fecha_registro), MONTH(fecha_registro)
        """, nativeQuery = true)
    List<CitaMesCountProjection> obtenerCitasPorMes(@Param("anio") Integer anio);

    @Query(value = """
        SELECT YEAR(fecha_registro) AS anio, COUNT(id) AS cantidad
        FROM citas
        WHERE fecha_registro IS NOT NULL
        GROUP BY YEAR(fecha_registro)
        ORDER BY YEAR(fecha_registro) ASC
        """, nativeQuery = true)
    List<com.backend.backend.DTO.CitaAnioCountProjection> obtenerCitasPorAnio();

    @Query("""
        SELECT new com.backend.backend.DTO.CitaTipoCount(
            COALESCE(NULLIF(TRIM(c.tipo_consulta), ''), TRIM(c.especialidad.nombre)),
            COUNT(c.id)
        )
        FROM Cita c
        WHERE (c.tipo_consulta IS NOT NULL AND TRIM(c.tipo_consulta) <> '')
           OR (c.especialidad.nombre IS NOT NULL AND TRIM(c.especialidad.nombre) <> '')
        GROUP BY COALESCE(NULLIF(TRIM(c.tipo_consulta), ''), TRIM(c.especialidad.nombre))
        ORDER BY COUNT(c.id) DESC
        """)
    List<CitaTipoCount> obtenerTiposCitaMasSolicitados();
    

    @Query("""
        SELECT new com.backend.backend.DTO.MedioPagoCount(
            TRIM(c.medio_pago),
            COUNT(c.id)
        )
        FROM Cita c
        WHERE c.medio_pago IS NOT NULL
          AND TRIM(c.medio_pago) <> ''
        GROUP BY TRIM(c.medio_pago)
        ORDER BY COUNT(c.id) DESC
        """)
    List<MedioPagoCount> obtenerMediosPagoMasSolicitados();

    @Query("""
        SELECT new com.backend.backend.DTO.CitaTipoCount(
            TRIM(c.motivo_consulta),
            COUNT(c.id)
        )
        FROM Cita c
        WHERE c.motivo_consulta IS NOT NULL
          AND TRIM(c.motivo_consulta) <> ''
        GROUP BY TRIM(c.motivo_consulta)
        ORDER BY COUNT(c.id) DESC
        """)
    List<CitaTipoCount> obtenerMotivosConsultaMasFrecuentes();

}
