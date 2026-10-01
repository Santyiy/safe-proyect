package com.safe.controller;

import com.safe.dto.PuestoRequestDTO;
import com.safe.dto.PuestoResponseDTO;
import com.safe.model.PuestoModel;
import com.safe.service.PuestoService;
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
@RequestMapping("/admin/puestos")
public class PuestoController {

    private final PuestoService puestoService;

    public PuestoController(PuestoService puestoService) {
        this.puestoService = puestoService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody PuestoRequestDTO dto) {
        Map<String, Object> response = new HashMap<>();

        try {
            PuestoModel puesto = puestoService.crear(dto);

            response.put("status", "ok");
            response.put("message", "Puesto creado correctamente");
            response.put("data", new PuestoResponseDTO(puesto));

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al crear el puesto: " + e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detalle(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        try {
            PuestoModel puesto = puestoService.obtenerDetalle(id);

            response.put("status", "ok");
            response.put("message", "Detalle del puesto obtenido correctamente");
            response.put("data", new PuestoResponseDTO(puesto));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Long id,
            @RequestBody PuestoRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {
            PuestoModel puesto = puestoService.actualizar(id, dto);

            response.put("status", "ok");
            response.put("message", "Puesto actualizado correctamente");
            response.put("data", new PuestoResponseDTO(puesto));

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
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        try {
            puestoService.eliminar(id);

            response.put("status", "ok");
            response.put("message", "Puesto eliminado correctamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
