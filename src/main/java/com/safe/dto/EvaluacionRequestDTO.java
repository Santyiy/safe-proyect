package com.safe.dto;

import java.math.BigDecimal;

public class EvaluacionRequestDTO {
    private String nombre;
    private String tipo;
    private String descripcion;
    private Integer duracion;
    private BigDecimal puntajeMin;
    private BigDecimal puntajeMax;
    private Boolean online;
    private Integer idPuesto; // Opcional, puede ser null si es general
    private String estado;

    // Constructores
    public EvaluacionRequestDTO() {}

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getDuracion() { return duracion; }
    public void setDuracion(Integer duracion) { this.duracion = duracion; }

    public BigDecimal getPuntajeMin() { return puntajeMin; }
    public void setPuntajeMin(BigDecimal puntajeMin) { this.puntajeMin = puntajeMin; }

    public BigDecimal getPuntajeMax() { return puntajeMax; }
    public void setPuntajeMax(BigDecimal puntajeMax) { this.puntajeMax = puntajeMax; }

    public Boolean getOnline() { return online; }
    public void setOnline(Boolean online) { this.online = online; }

    public Integer getIdPuesto() { return idPuesto; }
    public void setIdPuesto(Integer idPuesto) { this.idPuesto = idPuesto; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
