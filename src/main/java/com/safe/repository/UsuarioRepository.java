package com.safe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safe.model.UsuarioModel;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    Optional<UsuarioModel> findByEmail(String email);

    // 🔒 VALIDACIONES
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}