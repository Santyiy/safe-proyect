package com.safe.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "evaluacion")
public class EvaluacionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Nombre", length = 150)
    private String nombre;

    @Column(name = "Tipo", nullable = false, length = 100)
    private String tipo;

    @Column(name = "Descripcion", length = 2000)
    private String descripcion;

    @Column(name = "Duracion")
    private Integer duracion;

    @Column(name = "Puntaje_min", precision = 5, scale = 2)
    private BigDecimal puntajeMin;

    @Column(name = "Puntaje_max", precision = 5, scale = 2)
    private BigDecimal puntajeMax;

    @Column(name = "Online")
    private Boolean online = true;

    @Column(name = "ID_puesto")
    private Integer idPuesto;

    @Column(name = "Estado", length = 50)
    private String estado = "ACTIVA";

    // Constructores
    public EvaluacionModel() {}

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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
