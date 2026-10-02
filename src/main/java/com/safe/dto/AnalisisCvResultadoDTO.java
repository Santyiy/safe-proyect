package com.safe.dto;

import java.math.BigDecimal;

public class AnalisisCvResultadoDTO {

    private Long idPostulante;
    private Long idPuesto;
    private BigDecimal scoreIa;
    private String observacionesIa;
    private String estado;

    public Long getIdPostulante() {
        return idPostulante;
    }

    public void setIdPostulante(Long idPostulante) {
        this.idPostulante = idPostulante;
    }

    public Long getIdPuesto() {
        return idPuesto;
    }

    public void setIdPuesto(Long idPuesto) {
        this.idPuesto = idPuesto;
    }

    public BigDecimal getScoreIa() {
        return scoreIa;
    }

    public void setScoreIa(BigDecimal scoreIa) {
        this.scoreIa = scoreIa;
    }

    public String getObservacionesIa() {
        return observacionesIa;
    }

    public void setObservacionesIa(String observacionesIa) {
        this.observacionesIa = observacionesIa;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
