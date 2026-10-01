package com.safe.controller;

import com.safe.dto.PostulacionResponseDTO;
import com.safe.model.PostulacionModel;
import com.safe.service.PostulacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/postulante/postulaciones")
public class PostulacionController {

    private final PostulacionService postulacionService;

    public PostulacionController(PostulacionService postulacionService) {
        this.postulacionService = postulacionService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarDelPostulante(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        String email = authentication.getName();

        List<PostulacionResponseDTO> postulaciones = postulacionService.listarDelPostulante(email)
                .stream()
                .map(PostulacionResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Postulaciones listadas correctamente");
        response.put("data", postulaciones);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{idPuesto}")
    public ResponseEntity<Map<String, Object>> aplicarAPuesto(
            @PathVariable Long idPuesto,
            Authentication authentication) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // El email viene del token JWT configurado en JwtFilter
            String email = authentication.getName(); 
            
            PostulacionModel postulacion = postulacionService.postularse(email, idPuesto);
            
            response.put("status", "ok");
            response.put("message", "Postulación realizada con éxito. La IA está analizando tu perfil.");
            response.put("data", new PostulacionResponseDTO(postulacion));
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
            
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Ocurrió un error inesperado: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
