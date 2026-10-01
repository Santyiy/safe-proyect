package com.safe.dto;

import com.safe.model.PostulacionModel;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PostulacionResponseDTO {
    private Long idPostulante;
    private Long idPuesto;
    private String nombrePuesto;
    private LocalDateTime fechaPostulacion;
    private String estado;
    private BigDecimal scoreIa;
    private String observacionesIa;

    public PostulacionResponseDTO(PostulacionModel modelo) {
        this.idPostulante = modelo.getPostulante().getId();
        this.idPuesto = modelo.getPuesto().getId();
        this.nombrePuesto = modelo.getPuesto().getNombrePuesto();
        this.fechaPostulacion = modelo.getFechaPostulacion();
        this.estado = modelo.getEstado();
        this.scoreIa = modelo.getScoreIa();
        this.observacionesIa = modelo.getObservacionesIa();
    }

    // Agrega los Getters correspondientes aquí
    public Long getIdPostulante() { return idPostulante; }
    public Long getIdPuesto() { return idPuesto; }
    public String getNombrePuesto() { return nombrePuesto; }
    public LocalDateTime getFechaPostulacion() { return fechaPostulacion; }
    public String getEstado() { return estado; }
    public BigDecimal getScoreIa() { return scoreIa; }
    public String getObservacionesIa() { return observacionesIa; }
}