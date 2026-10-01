package com.safe.service;

import com.safe.model.PostulacionId;
import com.safe.model.PostulacionModel;
import com.safe.model.PostulanteModel;
import com.safe.model.PuestoModel;
import com.safe.repository.PostulacionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final PostulanteService postulanteService;
    private final PuestoService puestoService;
    private final RestTemplate restTemplate;

    private final String n8nWebhookUrl;

    public PostulacionService(PostulacionRepository postulacionRepository, 
                              PostulanteService postulanteService, 
                              PuestoService puestoService,
                              @Value("${n8n.webhook.analisis-cv-url:}") String n8nWebhookUrl) {
        this.postulacionRepository = postulacionRepository;
        this.postulanteService = postulanteService;
        this.puestoService = puestoService;
        this.n8nWebhookUrl = n8nWebhookUrl;
        this.restTemplate = new RestTemplate(); // Cliente HTTP para llamar a n8n
    }

    public PostulacionModel postularse(String emailPostulante, Long idPuesto) {
        PostulanteModel postulante = postulanteService.obtenerPorEmail(emailPostulante);
        PuestoModel puesto = puestoService.obtenerDetalle(idPuesto);

        PostulacionId id = new PostulacionId(postulante.getId(), puesto.getId());

        // Verificar si ya está postulado
        Optional<PostulacionModel> existe = postulacionRepository.findById(id);
        if (existe.isPresent()) {
            throw new RuntimeException("Ya te has postulado a este puesto.");
        }

        PostulacionModel nuevaPostulacion = new PostulacionModel();
        nuevaPostulacion.setId(id);
        nuevaPostulacion.setPostulante(postulante);
        nuevaPostulacion.setPuesto(puesto);
        nuevaPostulacion.setEstado("PENDIENTE");

        PostulacionModel guardada = postulacionRepository.save(nuevaPostulacion);

        // Enviar a n8n de forma asíncrona (recomendado usar @Async en producción)
        enviarDatosAn8n(postulante, puesto);

        return guardada;
    }

    public List<PostulacionModel> listarTodas() {
        return postulacionRepository.findAll();
    }

    public List<PostulacionModel> listarDelPostulante(String emailPostulante) {
        PostulanteModel postulante = postulanteService.obtenerPorEmail(emailPostulante);
        return postulacionRepository.findByPostulanteId(postulante.getId());
    }

    private void enviarDatosAn8n(PostulanteModel postulante, PuestoModel puesto) {
        try {
            if (n8nWebhookUrl == null || n8nWebhookUrl.trim().isEmpty()) {
                System.err.println("Webhook n8n no configurado: n8n.webhook.analisis-cv-url");
                return;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construir el payload con los datos necesarios para la IA
            Map<String, Object> payload = new HashMap<>();
            
            // Datos del Puesto
            Map<String, Object> datosPuesto = new HashMap<>();
            datosPuesto.put("id", puesto.getId());
            datosPuesto.put("nombre", puesto.getNombrePuesto());
            datosPuesto.put("requisitos", puesto.getRequisitos());
            payload.put("puesto", datosPuesto);

            // Datos del Postulante
            Map<String, Object> datosPostulante = new HashMap<>();
            datosPostulante.put("id", postulante.getId());
            datosPostulante.put("experiencia", postulante.getExperienciaLaboral());
            datosPostulante.put("estudios", postulante.getEstudios());
            datosPostulante.put("cvUrl", postulante.getCvUrl());
            payload.put("postulante", datosPostulante);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            // Llamada al webhook de n8n
            restTemplate.postForEntity(n8nWebhookUrl, request, String.class);
            
        } catch (Exception e) {
            // Manejar error (puedes registrar en logs y no interrumpir el flujo del usuario)
            System.err.println("Error al enviar datos a n8n: " + e.getMessage());
        }
    }
}
