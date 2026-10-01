package com.safe.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safe.dto.LoginDTO;
import com.safe.dto.RegisterDTO;
import com.safe.dto.UsuarioResponseDTO;
import com.safe.model.UsuarioModel;
import com.safe.service.UsuarioService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterDTO data) {
        try {
            UsuarioModel user = service.register(
                    data.getDni(),
                    data.getNombre(),
                    data.getEmail(),
                    data.getPassword()
            );

            UsuarioResponseDTO dto = new UsuarioResponseDTO(
                    user.getId(),
                    user.getDni(),
                    user.getNombre(),
                    user.getEmail(),
                    user.getRol()
            );

            return new ResponseEntity<>(Map.of(
                    "status", "ok",
                    "message", "Usuario registrado",
                    "data", dto
            ), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public Object login(@RequestBody LoginDTO data) {
        return service.login(data.getEmail(), data.getPassword());
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "message", "Logout exitoso (el cliente debe borrar el token)"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        UsuarioModel user = service.findByEmail(email);
        UsuarioResponseDTO dto = new UsuarioResponseDTO(
                user.getId(),
                user.getDni(),
                user.getNombre(),
                user.getEmail(),
                user.getRol()
        );

        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "user", dto
        ));
    }

    @GetMapping("/test")
    public String test() {
        return "FUNCIONA";
    }
}
