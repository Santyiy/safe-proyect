package com.safe.service;

import com.safe.dto.EvaluacionAsignadaRequestDTO;
import com.safe.model.EvaluacionAsignadaModel;
import com.safe.model.EvaluacionModel;
import com.safe.model.PostulanteModel;
import com.safe.model.UsuarioModel;
import com.safe.repository.EvaluacionAsignadaRepository;
import com.safe.repository.PostulanteRepository;
import com.safe.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluacionAsignadaService {

    private final EvaluacionAsignadaRepository evaluacionAsignadaRepository;
    private final EvaluacionService evaluacionService;
    private final PostulanteRepository postulanteRepository;
    private final UsuarioRepository usuarioRepository;

    public EvaluacionAsignadaService(
            EvaluacionAsignadaRepository evaluacionAsignadaRepository,
            EvaluacionService evaluacionService,
            PostulanteRepository postulanteRepository,
            UsuarioRepository usuarioRepository) {

        this.evaluacionAsignadaRepository = evaluacionAsignadaRepository;
        this.evaluacionService = evaluacionService;
        this.postulanteRepository = postulanteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public EvaluacionAsignadaModel asignar(EvaluacionAsignadaRequestDTO dto) {
        validar(dto);

        EvaluacionModel evaluacion = evaluacionService.obtenerPorId(dto.getIdEvaluacion());
        PostulanteModel postulante = postulanteRepository.findById(dto.getIdPostulante())
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        EvaluacionAsignadaModel asignacion = new EvaluacionAsignadaModel();
        asignacion.setEvaluacion(evaluacion);
        asignacion.setPostulante(postulante);
        asignacion.setFecha(dto.getFecha());
        asignacion.setHoraInicio(dto.getHoraInicio());
        asignacion.setHoraFin(dto.getHoraFin());
        asignacion.setObservaciones(dto.getObservaciones());
        asignacion.setEstado("PENDIENTE");
        asignacion.setIntento(1);

        return evaluacionAsignadaRepository.save(asignacion);
    }

    public List<EvaluacionAsignadaModel> listarTodas() {
        return evaluacionAsignadaRepository.findAll();
    }

    public List<EvaluacionAsignadaModel> listarDelPostulante(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PostulanteModel postulante = postulanteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Perfil de postulante no encontrado"));

        return evaluacionAsignadaRepository.findByPostulanteOrderByFechaDescHoraInicioDesc(postulante);
    }

    public EvaluacionAsignadaModel cambiarEstado(Long id, String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado es obligatorio");
        }

        EvaluacionAsignadaModel asignacion = obtenerPorId(id);
        asignacion.setEstado(estado.trim().toUpperCase());

        return evaluacionAsignadaRepository.save(asignacion);
    }

    public EvaluacionAsignadaModel obtenerPorId(Long id) {
        return evaluacionAsignadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignacion de evaluacion no encontrada"));
    }

    private void validar(EvaluacionAsignadaRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos de la asignacion son obligatorios");
        }

        if (dto.getIdEvaluacion() == null) {
            throw new IllegalArgumentException("La evaluacion es obligatoria");
        }

        if (dto.getIdPostulante() == null) {
            throw new IllegalArgumentException("El postulante es obligatorio");
        }

        if (dto.getFecha() == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }

        if (dto.getHoraInicio() == null || dto.getHoraFin() == null) {
            throw new IllegalArgumentException("La hora de inicio y fin son obligatorias");
        }

        if (!dto.getHoraFin().isAfter(dto.getHoraInicio())) {
            throw new IllegalArgumentException("La hora de fin debe ser posterior a la hora de inicio");
        }
    }
}
