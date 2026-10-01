package com.safe.controller;

import com.safe.dto.EvaluacionAsignadaRequestDTO;
import com.safe.dto.EvaluacionAsignadaResponseDTO;
import com.safe.model.EvaluacionAsignadaModel;
import com.safe.service.EvaluacionAsignadaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EvaluacionAsignadaController {

    private final EvaluacionAsignadaService evaluacionAsignadaService;

    public EvaluacionAsignadaController(EvaluacionAsignadaService evaluacionAsignadaService) {
        this.evaluacionAsignadaService = evaluacionAsignadaService;
    }

    @PostMapping("/admin/evaluaciones/asignaciones")
    public ResponseEntity<Map<String, Object>> asignar(@RequestBody EvaluacionAsignadaRequestDTO dto) {
        Map<String, Object> response = new HashMap<>();

        try {
            EvaluacionAsignadaModel asignacion = evaluacionAsignadaService.asignar(dto);

            response.put("status", "ok");
            response.put("message", "Evaluacion asignada correctamente");
            response.put("data", new EvaluacionAsignadaResponseDTO(asignacion));

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/admin/evaluaciones/asignaciones")
    public ResponseEntity<Map<String, Object>> listarTodas() {
        Map<String, Object> response = new HashMap<>();
        List<EvaluacionAsignadaResponseDTO> asignaciones = evaluacionAsignadaService.listarTodas()
                .stream()
                .map(EvaluacionAsignadaResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Asignaciones listadas correctamente");
        response.put("data", asignaciones);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/evaluaciones/asignaciones/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {

        Map<String, Object> response = new HashMap<>();

        try {
            EvaluacionAsignadaModel asignacion = evaluacionAsignadaService.cambiarEstado(id, estado);

            response.put("status", "ok");
            response.put("message", "Estado de asignacion actualizado correctamente");
            response.put("data", new EvaluacionAsignadaResponseDTO(asignacion));

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/postulante/evaluaciones/asignadas")
    public ResponseEntity<Map<String, Object>> listarDelPostulante(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        String email = authentication.getName();

        List<EvaluacionAsignadaResponseDTO> asignaciones = evaluacionAsignadaService.listarDelPostulante(email)
                .stream()
                .map(EvaluacionAsignadaResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Evaluaciones asignadas listadas correctamente");
        response.put("data", asignaciones);

        return ResponseEntity.ok(response);
    }
}
