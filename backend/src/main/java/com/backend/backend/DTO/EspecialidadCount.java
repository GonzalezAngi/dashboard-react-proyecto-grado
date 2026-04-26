package com.backend.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadCount {
    private Integer id;
    private String nombre;
    private String estado;
    private Long cantidadSolicitudes;
}
