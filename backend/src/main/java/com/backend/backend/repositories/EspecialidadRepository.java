package com.backend.backend.repositories;

import com.backend.backend.DTO.EspecialidadCount;
import com.backend.backend.models.Especialidad;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspecialidadRepository extends CrudRepository<Especialidad, Integer> {
    
    @Query("""
        SELECT new com.backend.backend.DTO.EspecialidadCount(
            e.id, 
            e.nombre, 
            e.estado, 
            COUNT(c.id) as cantidadSolicitudes
        ) 
        FROM Especialidad e 
        LEFT JOIN Cita c ON e.id = c.especialidad.id 
        GROUP BY e.id, e.nombre, e.estado 
        ORDER BY cantidadSolicitudes DESC
        """)
    List<EspecialidadCount> obtenerEspecialidadesMasSolicitadas();
}