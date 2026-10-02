package com.safe.controller;

import com.safe.dto.AnalisisCvResultadoDTO;
import com.safe.dto.PostulacionResponseDTO;
import com.safe.model.PostulacionModel;
import com.safe.service.PostulacionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/webhooks/n8n")
public class N8nWebhookController {

    private final PostulacionService postulacionService;
    private final String webhookSecret;

    public N8nWebhookController(
            PostulacionService postulacionService,
            @Value("${n8n.webhook.result-secret:}") String webhookSecret) {
        this.postulacionService = postulacionService;
        this.webhookSecret = webhookSecret;
    }

    @PostMapping("/analisis-cv")
    public ResponseEntity<Map<String, Object>> recibirResultadoAnalisisCv(
            @RequestBody AnalisisCvResultadoDTO dto,
            @RequestHeader(value = "X-SAFE-WEBHOOK-SECRET", required = false) String receivedSecret) {

        if (webhookSecret != null && !webhookSecret.isBlank() && !webhookSecret.equals(receivedSecret)) {
            return new ResponseEntity<>(Map.of(
                    "status", "error",
                    "message", "Webhook no autorizado"
            ), HttpStatus.UNAUTHORIZED);
        }

        try {
            PostulacionModel postulacion = postulacionService.actualizarResultadoAnalisisCv(dto);

            return ResponseEntity.ok(Map.of(
                    "status", "ok",
                    "message", "Resultado de analisis CV recibido correctamente",
                    "data", new PostulacionResponseDTO(postulacion)
            ));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ), HttpStatus.NOT_FOUND);
        }
    }
}
