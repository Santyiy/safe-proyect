package com.safe.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "pregunta")
public class PreguntaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_evaluacion", nullable = false)
    private EvaluacionModel evaluacion;

    @Column(name = "Pregunta", nullable = false, length = 2000)
    private String pregunta;

    @Column(name = "Tipo", nullable = false, length = 100)
    private String tipo;

    @Column(name = "Respuesta_correcta", nullable = false, length = 2000)
    private String respuestaCorrecta;

    @Column(name = "Peso", precision = 5, scale = 2)
    private BigDecimal peso;

    public Long getId() {
        return id;
    }

    public EvaluacionModel getEvaluacion() {
        return evaluacion;
    }

    public void setEvaluacion(EvaluacionModel evaluacion) {
        this.evaluacion = evaluacion;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getRespuestaCorrecta() {
        return respuestaCorrecta;
    }

    public void setRespuestaCorrecta(String respuestaCorrecta) {
        this.respuestaCorrecta = respuestaCorrecta;
    }

    public BigDecimal getPeso() {
        return peso;
    }

    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }
}
