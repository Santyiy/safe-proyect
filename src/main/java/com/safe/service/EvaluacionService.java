package com.safe.service;

import com.safe.dto.EvaluacionRequestDTO;
import com.safe.model.EvaluacionModel;
import com.safe.repository.EvaluacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;

    public EvaluacionService(EvaluacionRepository evaluacionRepository) {
        this.evaluacionRepository = evaluacionRepository;
    }

    public EvaluacionModel crearEvaluacion(EvaluacionRequestDTO dto) {
        validar(dto);

        EvaluacionModel evaluacion = new EvaluacionModel();
        cargarDatos(evaluacion, dto);

        return evaluacionRepository.save(evaluacion);
    }

    public List<EvaluacionModel> listar() {
        return evaluacionRepository.findAll();
    }

    public EvaluacionModel obtenerPorId(Integer id) {
        return evaluacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluacion no encontrada"));
    }

    public EvaluacionModel actualizar(Integer id, EvaluacionRequestDTO dto) {
        validar(dto);

        EvaluacionModel evaluacion = obtenerPorId(id);
        cargarDatos(evaluacion, dto);

        return evaluacionRepository.save(evaluacion);
    }

    public void eliminar(Integer id) {
        EvaluacionModel evaluacion = obtenerPorId(id);
        evaluacionRepository.delete(evaluacion);
    }

    private void cargarDatos(EvaluacionModel evaluacion, EvaluacionRequestDTO dto) {
        evaluacion.setNombre(dto.getNombre().trim());
        evaluacion.setTipo(dto.getTipo().trim());
        evaluacion.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
        evaluacion.setDuracion(dto.getDuracion());
        evaluacion.setPuntajeMin(dto.getPuntajeMin());
        evaluacion.setPuntajeMax(dto.getPuntajeMax());
        evaluacion.setOnline(dto.getOnline() != null ? dto.getOnline() : true);
        evaluacion.setIdPuesto(dto.getIdPuesto());
        evaluacion.setEstado(dto.getEstado() != null && !dto.getEstado().trim().isEmpty()
                ? dto.getEstado().trim().toUpperCase()
                : "ACTIVA");
    }

    private void validar(EvaluacionRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos de la evaluacion son obligatorios");
        }

        if (estaVacio(dto.getNombre())) {
            throw new IllegalArgumentException("El nombre de la evaluacion es obligatorio");
        }

        if (estaVacio(dto.getTipo())) {
            throw new IllegalArgumentException("El tipo de evaluacion es obligatorio");
        }

        if (dto.getDuracion() == null || dto.getDuracion() <= 0) {
            throw new IllegalArgumentException("La duracion debe ser mayor a cero");
        }

        if (dto.getPuntajeMin() == null || dto.getPuntajeMax() == null) {
            throw new IllegalArgumentException("Los puntajes minimo y maximo son obligatorios");
        }

        if (dto.getPuntajeMin().compareTo(dto.getPuntajeMax()) > 0) {
            throw new IllegalArgumentException("El puntaje minimo no puede ser mayor al maximo");
        }
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}
