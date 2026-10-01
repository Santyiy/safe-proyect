package com.safe.controller;

import com.safe.dto.PostulacionResponseDTO;
import com.safe.service.PostulacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/postulaciones")
public class AdminPostulacionController {

    private final PostulacionService postulacionService;

    public AdminPostulacionController(PostulacionService postulacionService) {
        this.postulacionService = postulacionService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodas() {
        Map<String, Object> response = new HashMap<>();
        List<PostulacionResponseDTO> postulaciones = postulacionService.listarTodas()
                .stream()
                .map(PostulacionResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Postulaciones listadas correctamente");
        response.put("data", postulaciones);

        return ResponseEntity.ok(response);
    }
}
