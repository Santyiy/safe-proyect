package com.safe.controller;

import com.safe.dto.PuestoResponseDTO;
import com.safe.service.PuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/puestos")
public class PublicPuestoController {

    private final PuestoService puestoService;

    public PublicPuestoController(PuestoService puestoService) {
        this.puestoService = puestoService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar() {
        Map<String, Object> response = new HashMap<>();
        List<PuestoResponseDTO> puestos = puestoService.listar()
                .stream()
                .map(PuestoResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Puestos listados correctamente");
        response.put("data", puestos);

        return ResponseEntity.ok(response);
    }
}
