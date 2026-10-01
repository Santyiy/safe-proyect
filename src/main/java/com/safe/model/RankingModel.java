package com.safe.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity(name = "Ranking")
@Table(name = "ranking")
public class RankingModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_postulante", unique = true)
    private Integer idPostulante;

    @Column(name = "promedio_final")
    private BigDecimal promedioFinal;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getIdPostulante() { return idPostulante; }
    public void setIdPostulante(Integer idPostulante) { this.idPostulante = idPostulante; }
    public BigDecimal getPromedioFinal() { return promedioFinal; }
    public void setPromedioFinal(BigDecimal promedioFinal) { this.promedioFinal = promedioFinal; }
}