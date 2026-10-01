package com.safe.dto;

import com.safe.model.PuestoModel;

public class PuestoResponseDTO {

    private Long id;
    private String nombrePuesto;
    private String tipo;
    private String requisitos;

    public PuestoResponseDTO(PuestoModel puesto) {
        this.id = puesto.getId();
        this.nombrePuesto = puesto.getNombrePuesto();
        this.tipo = puesto.getTipo();
        this.requisitos = puesto.getRequisitos();
    }

    public Long getId() {
        return id;
    }

    public String getNombrePuesto() {
        return nombrePuesto;
    }

    public String getTipo() {
        return tipo;
    }

    public String getRequisitos() {
        return requisitos;
    }
}
