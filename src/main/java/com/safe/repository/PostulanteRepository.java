package com.safe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safe.model.PostulanteModel;
import com.safe.model.UsuarioModel;

public interface PostulanteRepository
        extends JpaRepository<PostulanteModel, Long> {

    Optional<PostulanteModel> findByUsuario(UsuarioModel usuario);
}