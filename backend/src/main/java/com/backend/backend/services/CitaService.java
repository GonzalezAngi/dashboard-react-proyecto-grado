package com.backend.backend.services;

import com.backend.backend.DTO.BarrioCitaCount;
import com.backend.backend.DTO.CitaMesCount;
import com.backend.backend.DTO.CitaMesCountProjection;
import com.backend.backend.DTO.CitaTipoCount;
import com.backend.backend.models.Cita;
import com.backend.backend.repositories.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
        return citaRepository.obtenerBarriosMasSolicitados();
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
}
