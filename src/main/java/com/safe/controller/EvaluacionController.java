package com.safe.controller;

import com.safe.dto.EvaluacionRequestDTO;
import com.safe.dto.EvaluacionResponseDTO;
import com.safe.model.EvaluacionModel;
import com.safe.service.EvaluacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/evaluaciones")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    public EvaluacionController(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody EvaluacionRequestDTO dto) {
        Map<String, Object> response = new HashMap<>();

        try {
            EvaluacionModel evaluacion = evaluacionService.crearEvaluacion(dto);

            response.put("status", "ok");
            response.put("message", "Evaluacion creada correctamente");
            response.put("data", new EvaluacionResponseDTO(evaluacion));

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al crear la evaluacion: " + e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar() {
        Map<String, Object> response = new HashMap<>();
        List<EvaluacionResponseDTO> evaluaciones = evaluacionService.listar()
                .stream()
                .map(EvaluacionResponseDTO::new)
                .toList();

        response.put("status", "ok");
        response.put("message", "Evaluaciones listadas correctamente");
        response.put("data", evaluaciones);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detalle(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            EvaluacionModel evaluacion = evaluacionService.obtenerPorId(id);

            response.put("status", "ok");
            response.put("message", "Detalle de evaluacion obtenido correctamente");
            response.put("data", new EvaluacionResponseDTO(evaluacion));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Integer id,
            @RequestBody EvaluacionRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {
            EvaluacionModel evaluacion = evaluacionService.actualizar(id, dto);

            response.put("status", "ok");
            response.put("message", "Evaluacion actualizada correctamente");
            response.put("data", new EvaluacionResponseDTO(evaluacion));

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            evaluacionService.eliminar(id);

            response.put("status", "ok");
            response.put("message", "Evaluacion eliminada correctamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
