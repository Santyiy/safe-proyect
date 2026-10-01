package com.safe.controller;

import com.safe.dto.PreguntaRequestDTO;
import com.safe.dto.PreguntaResponseDTO;
import com.safe.model.PreguntaModel;
import com.safe.service.PreguntaService;
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
public class PreguntaController {

    private final PreguntaService preguntaService;

    public PreguntaController(PreguntaService preguntaService) {
        this.preguntaService = preguntaService;
    }

    @PostMapping("/{idEvaluacion}/preguntas")
    public ResponseEntity<Map<String, Object>> crear(
            @PathVariable Integer idEvaluacion,
            @RequestBody PreguntaRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {
            PreguntaModel pregunta = preguntaService.crear(idEvaluacion, dto);

            response.put("status", "ok");
            response.put("message", "Pregunta creada correctamente");
            response.put("data", new PreguntaResponseDTO(pregunta));

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

    @GetMapping("/{idEvaluacion}/preguntas")
    public ResponseEntity<Map<String, Object>> listar(@PathVariable Integer idEvaluacion) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<PreguntaResponseDTO> preguntas = preguntaService.listarPorEvaluacion(idEvaluacion)
                    .stream()
                    .map(PreguntaResponseDTO::new)
                    .toList();

            response.put("status", "ok");
            response.put("message", "Preguntas listadas correctamente");
            response.put("data", preguntas);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/preguntas/{idPregunta}")
    public ResponseEntity<Map<String, Object>> detalle(@PathVariable Long idPregunta) {
        Map<String, Object> response = new HashMap<>();

        try {
            PreguntaModel pregunta = preguntaService.obtenerPorId(idPregunta);

            response.put("status", "ok");
            response.put("message", "Detalle de pregunta obtenido correctamente");
            response.put("data", new PreguntaResponseDTO(pregunta));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/preguntas/{idPregunta}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Long idPregunta,
            @RequestBody PreguntaRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {
            PreguntaModel pregunta = preguntaService.actualizar(idPregunta, dto);

            response.put("status", "ok");
            response.put("message", "Pregunta actualizada correctamente");
            response.put("data", new PreguntaResponseDTO(pregunta));

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

    @DeleteMapping("/preguntas/{idPregunta}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long idPregunta) {
        Map<String, Object> response = new HashMap<>();

        try {
            preguntaService.eliminar(idPregunta);

            response.put("status", "ok");
            response.put("message", "Pregunta eliminada correctamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
