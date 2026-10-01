package com.safe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.safe.dto.PostulanteRequestDTO;
import com.safe.model.PostulanteModel;
import com.safe.model.UsuarioModel;
import com.safe.repository.PostulanteRepository;
import com.safe.repository.UsuarioRepository;

@Service
public class PostulanteService {

    private final PostulanteRepository postulanteRepo;
    private final UsuarioRepository usuarioRepo;

    public PostulanteService(PostulanteRepository postulanteRepo,
                             UsuarioRepository usuarioRepo) {

        this.postulanteRepo = postulanteRepo;
        this.usuarioRepo = usuarioRepo;
    }

    // =========================
    // CREAR PERFIL
    // =========================
    public PostulanteModel crear(PostulanteRequestDTO dto,
                                 String email) {

        UsuarioModel usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        PostulanteModel postulante = new PostulanteModel();

        postulante.setTelefono(dto.getTelefono());
        postulante.setDireccion(dto.getDireccion());
        postulante.setFechaNacimiento(dto.getFechaNacimiento());
        postulante.setEstadoCivil(dto.getEstadoCivil());
        postulante.setExperienciaLaboral(dto.getExperienciaLaboral());
        postulante.setEstudios(dto.getEstudios());
        postulante.setInfoMedica(dto.getInfoMedica());
        postulante.setCvUrl(dto.getCvUrl());
        postulante.setAptoMedicoUrl(dto.getAptoMedicoUrl());

        postulante.setUsuario(usuario);

        return postulanteRepo.save(postulante);
    }

    // =========================
    // OBTENER PERFIL
    // =========================
    public PostulanteModel obtenerPorEmail(String email) {

        UsuarioModel usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        return postulanteRepo.findByUsuario(usuario)
                .orElseThrow(() ->
                        new RuntimeException("Perfil no encontrado"));
    }

    // =========================
    // LISTAR TODOS
    // =========================
    public List<PostulanteModel> listar() {
        return postulanteRepo.findAll();
    }

    // =========================
    // ACTUALIZAR
    // =========================
    public PostulanteModel actualizar(String email,
                                      PostulanteRequestDTO dto) {

        UsuarioModel usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        PostulanteModel postulante = postulanteRepo.findByUsuario(usuario)
                .orElseThrow(() ->
                        new RuntimeException("Perfil no encontrado"));

        postulante.setTelefono(dto.getTelefono());
        postulante.setDireccion(dto.getDireccion());
        postulante.setFechaNacimiento(dto.getFechaNacimiento());
        postulante.setEstadoCivil(dto.getEstadoCivil());
        postulante.setExperienciaLaboral(dto.getExperienciaLaboral());
        postulante.setEstudios(dto.getEstudios());
        postulante.setInfoMedica(dto.getInfoMedica());
        postulante.setCvUrl(dto.getCvUrl());
        postulante.setAptoMedicoUrl(dto.getAptoMedicoUrl());

        return postulanteRepo.save(postulante);
    }

    // =========================
    // ELIMINAR
    // =========================
    public void eliminar(String email) {

        UsuarioModel usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        PostulanteModel postulante = postulanteRepo.findByUsuario(usuario)
                .orElseThrow(() ->
                        new RuntimeException("Perfil no encontrado"));

        postulanteRepo.delete(postulante);
    }
}