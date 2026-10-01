package com.safe.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "evaluacion_asignada")
public class EvaluacionAsignadaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_evaluacion", nullable = false)
    private EvaluacionModel evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_postulante", nullable = false)
    private PostulanteModel postulante;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "Hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "Hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "Estado", nullable = false, length = 50)
    private String estado = "PENDIENTE";

    @Column(name = "Intento", nullable = false)
    private Integer intento = 1;

    @Column(name = "Fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;

    @Column(name = "Observaciones", length = 1000)
    private String observaciones;

    @PrePersist
    public void prePersist() {
        if (fechaAsignacion == null) {
            fechaAsignacion = LocalDateTime.now();
        }

        if (estado == null) {
            estado = "PENDIENTE";
        }

        if (intento == null) {
            intento = 1;
        }
    }

    public Long getId() {
        return id;
    }

    public EvaluacionModel getEvaluacion() {
        return evaluacion;
    }

    public void setEvaluacion(EvaluacionModel evaluacion) {
        this.evaluacion = evaluacion;
    }

    public PostulanteModel getPostulante() {
        return postulante;
    }

    public void setPostulante(PostulanteModel postulante) {
        this.postulante = postulante;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getIntento() {
        return intento;
    }

    public void setIntento(Integer intento) {
        this.intento = intento;
    }

    public LocalDateTime getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(LocalDateTime fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
