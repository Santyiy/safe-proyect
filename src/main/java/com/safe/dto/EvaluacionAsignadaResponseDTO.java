package com.safe.dto;

import com.safe.model.EvaluacionAsignadaModel;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EvaluacionAsignadaResponseDTO {

    private Long id;
    private Integer idEvaluacion;
    private String nombreEvaluacion;
    private String tipoEvaluacion;
    private Long idPostulante;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private Integer intento;
    private LocalDateTime fechaAsignacion;
    private String observaciones;

    public EvaluacionAsignadaResponseDTO(EvaluacionAsignadaModel asignacion) {
        this.id = asignacion.getId();
        this.idEvaluacion = asignacion.getEvaluacion().getId();
        this.nombreEvaluacion = asignacion.getEvaluacion().getNombre();
        this.tipoEvaluacion = asignacion.getEvaluacion().getTipo();
        this.idPostulante = asignacion.getPostulante().getId();
        this.fecha = asignacion.getFecha();
        this.horaInicio = asignacion.getHoraInicio();
        this.horaFin = asignacion.getHoraFin();
        this.estado = asignacion.getEstado();
        this.intento = asignacion.getIntento();
        this.fechaAsignacion = asignacion.getFechaAsignacion();
        this.observaciones = asignacion.getObservaciones();
    }

    public Long getId() {
        return id;
    }

    public Integer getIdEvaluacion() {
        return idEvaluacion;
    }

    public String getNombreEvaluacion() {
        return nombreEvaluacion;
    }

    public String getTipoEvaluacion() {
        return tipoEvaluacion;
    }

    public Long getIdPostulante() {
        return idPostulante;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public String getEstado() {
        return estado;
    }

    public Integer getIntento() {
        return intento;
    }

    public LocalDateTime getFechaAsignacion() {
        return fechaAsignacion;
    }

    public String getObservaciones() {
        return observaciones;
    }
}
