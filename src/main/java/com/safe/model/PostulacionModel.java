package com.safe.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "postulacion")
public class PostulacionModel {

    @EmbeddedId
    private PostulacionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPostulante")
    @JoinColumn(name = "ID_postulante")
    private PostulanteModel postulante;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPuesto")
    @JoinColumn(name = "ID_puesto")
    private PuestoModel puesto;

    @Column(name = "Fecha_postulacion", insertable = false, updatable = false)
    private LocalDateTime fechaPostulacion;

    @Column(name = "Estado", length = 50)
    private String estado = "PENDIENTE";

    @Column(name = "Score_IA", precision = 5, scale = 2)
    private BigDecimal scoreIa;

    @Column(name = "Observaciones_IA", columnDefinition = "TEXT")
    private String observacionesIa;

    @Column(name = "Fecha_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaActualizacion;

    public PostulacionModel() {}

    // Getters y Setters
    public PostulacionId getId() { return id; }
    public void setId(PostulacionId id) { this.id = id; }

    public PostulanteModel getPostulante() { return postulante; }
    public void setPostulante(PostulanteModel postulante) { this.postulante = postulante; }

    public PuestoModel getPuesto() { return puesto; }
    public void setPuesto(PuestoModel puesto) { this.puesto = puesto; }

    public LocalDateTime getFechaPostulacion() { return fechaPostulacion; }
    public void setFechaPostulacion(LocalDateTime fechaPostulacion) { this.fechaPostulacion = fechaPostulacion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public BigDecimal getScoreIa() { return scoreIa; }
    public void setScoreIa(BigDecimal scoreIa) { this.scoreIa = scoreIa; }

    public String getObservacionesIa() { return observacionesIa; }
    public void setObservacionesIa(String observacionesIa) { this.observacionesIa = observacionesIa; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}