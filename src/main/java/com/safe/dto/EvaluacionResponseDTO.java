package com.safe.dto;

import com.safe.model.EvaluacionModel;

import java.math.BigDecimal;

public class EvaluacionResponseDTO {

    private Integer id;
    private String nombre;
    private String tipo;
    private String descripcion;
    private Integer duracion;
    private BigDecimal puntajeMin;
    private BigDecimal puntajeMax;
    private Boolean online;
    private Integer idPuesto;
    private String estado;

    public EvaluacionResponseDTO(EvaluacionModel evaluacion) {
        this.id = evaluacion.getId();
        this.nombre = evaluacion.getNombre();
        this.tipo = evaluacion.getTipo();
        this.descripcion = evaluacion.getDescripcion();
        this.duracion = evaluacion.getDuracion();
        this.puntajeMin = evaluacion.getPuntajeMin();
        this.puntajeMax = evaluacion.getPuntajeMax();
        this.online = evaluacion.getOnline();
        this.idPuesto = evaluacion.getIdPuesto();
        this.estado = evaluacion.getEstado();
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public BigDecimal getPuntajeMin() {
        return puntajeMin;
    }

    public BigDecimal getPuntajeMax() {
        return puntajeMax;
    }

    public Boolean getOnline() {
        return online;
    }

    public Integer getIdPuesto() {
        return idPuesto;
    }

    public String getEstado() {
        return estado;
    }
}
