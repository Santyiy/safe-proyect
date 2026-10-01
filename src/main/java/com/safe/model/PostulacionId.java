package com.safe.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PostulacionId implements Serializable {

    private Long idPostulante;
    private Long idPuesto;

    public PostulacionId() {}

    public PostulacionId(Long idPostulante, Long idPuesto) {
        this.idPostulante = idPostulante;
        this.idPuesto = idPuesto;
    }

    public Long getIdPostulante() { return idPostulante; }
    public void setIdPostulante(Long idPostulante) { this.idPostulante = idPostulante; }

    public Long getIdPuesto() { return idPuesto; }
    public void setIdPuesto(Long idPuesto) { this.idPuesto = idPuesto; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostulacionId that = (PostulacionId) o;
        return Objects.equals(idPostulante, that.idPostulante) &&
               Objects.equals(idPuesto, that.idPuesto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPostulante, idPuesto);
    }
}