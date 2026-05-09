package com.backend.backend.services;

import com.backend.backend.DTO.BarrioCitaCount;
import com.backend.backend.DTO.CitaMesCount;
import com.backend.backend.DTO.CitaMesCountProjection;
import com.backend.backend.DTO.CitaTipoCount;
import com.backend.backend.DTO.MedioPagoCount;
import com.backend.backend.models.Cita;
import com.backend.backend.repositories.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CitaService {
    @Autowired
    CitaRepository citaRepository;

    public ArrayList<Cita> obtenerCita(){
        return (ArrayList<Cita>)citaRepository.findAll();
    }

    public ArrayList<Cita> obtenerCitaPorMedicoId(Integer medicoId){
        return citaRepository.findCitaByMedico_Id(medicoId);
    }
    public Cita guardarCita(Cita cita) {
        return citaRepository.save(cita);
    }
    public void eliminar(Integer id){
        citaRepository.deleteById(id);
    }
    
    public ArrayList<Cita> obtenerCitaPorId_usuario(Integer id){
        if(citaRepository.findCitaByUsuario_Id(id).isEmpty()){
            return null;
        }else {
            return citaRepository.findCitaByUsuario_Id(id); 
        }
        
    }

    public List<BarrioCitaCount> obtenerBarriosMasSolicitados(){
        List<Cita> citas = (List<Cita>) citaRepository.findAll();

        Map<String, Long> agrupado = citas.stream()
            .map(Cita::getDireccion)
            .filter(Objects::nonNull)
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(s -> {
                String[] partes = s.split(",");
                if (partes.length >= 4) {
                    return partes[3].trim();
                }
                return s; // fallback: use full direccion if no 4º campo
            })
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        return agrupado.entrySet().stream()
            .map(e -> new BarrioCitaCount(e.getKey(), e.getValue()))
            .sorted((a, b) -> b.getCantidadSolicitudes().compareTo(a.getCantidadSolicitudes()))
            .collect(Collectors.toList());
    }

    public List<CitaMesCount> obtenerCitasPorMes(Integer anio) {
        List<CitaMesCountProjection> filas = citaRepository.obtenerCitasPorMes(anio);
        List<CitaMesCount> resultados = new ArrayList<>();
        
        java.util.List<Integer> aniosBuscados = new java.util.ArrayList<>();
        if (anio != null) {
            aniosBuscados.add(anio);
        } else {
            aniosBuscados = filas.stream()
                .map(CitaMesCountProjection::getAnio)
                .distinct()
                .collect(java.util.stream.Collectors.toList());
            if (aniosBuscados.isEmpty()) {
                aniosBuscados.add(java.time.Year.now().getValue());
            }
        }

        for (Integer a : aniosBuscados) {
            for (int i = 1; i <= 12; i++) {
                int mes = i;
                long cantidad = filas.stream()
                    .filter(f -> f.getAnio().equals(a) && f.getMes() == mes)
                    .mapToLong(CitaMesCountProjection::getCantidad)
                    .findFirst()
                    .orElse(0L);
                resultados.add(new CitaMesCount(a, mes, cantidad));
            }
        }
        
        return resultados;
    }

    public List<com.backend.backend.DTO.CitaAnioCount> obtenerCitasPorAnio() {
        return citaRepository.obtenerCitasPorAnio().stream()
            .map(p -> new com.backend.backend.DTO.CitaAnioCount(p.getAnio(), p.getCantidad()))
            .collect(java.util.stream.Collectors.toList());
    }

    public List<CitaTipoCount> obtenerTiposCitaMasSolicitados() {
        return citaRepository.obtenerTiposCitaMasSolicitados();
    }


    public List<CitaTipoCount> obtenerMotivosConsultaMasFrecuentes() {
        List<Cita> citas = (List<Cita>) citaRepository.findAll();

        Map<String, Long> agrupado = citas.stream()
            .map(Cita::getMotivo_consulta)
            .filter(Objects::nonNull)
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .flatMap(s -> java.util.Arrays.stream(s.split(",")))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(s -> {
                String lower = s.toLowerCase();
                if (lower.length() == 0) return lower;
                return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
            })
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        return agrupado.entrySet().stream()
            .map(e -> new CitaTipoCount(e.getKey(), e.getValue()))
            .sorted((a, b) -> b.getCantidad().compareTo(a.getCantidad()))
            .collect(java.util.stream.Collectors.toList());
    }

    public CitaTipoCount obtenerTipoCitaMasSolicitado() {
        List<CitaTipoCount> lista = obtenerTiposCitaMasSolicitados();
        if (lista == null || lista.isEmpty()) {
            return null;
        }
        return lista.get(0);
    }

    public List<MedioPagoCount> obtenerMediosPagoMasSolicitados() {
        return citaRepository.obtenerMediosPagoMasSolicitados();
    }

    public MedioPagoCount obtenerMedioPagoMasSolicitado() {
        List<MedioPagoCount> lista = obtenerMediosPagoMasSolicitados();
        if (lista == null || lista.isEmpty()) {
            return null;
        }
        return lista.get(0);
    }

    public List<MedioPagoCount> obtenerTopNMediosPagoMasSolicitados(Integer limit) {
        List<MedioPagoCount> lista = obtenerMediosPagoMasSolicitados();
        if (lista == null || lista.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        if (limit == null || limit <= 0) {
            limit = 5;
        }
        return lista.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }

    public List<CitaTipoCount> obtenerTopNTiposCitaMasSolicitados(Integer limit) {
        List<CitaTipoCount> lista = obtenerTiposCitaMasSolicitados();
        if (lista == null || lista.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        if (limit == null || limit <= 0) {
            limit = 5; // default
        }
        return lista.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }
}