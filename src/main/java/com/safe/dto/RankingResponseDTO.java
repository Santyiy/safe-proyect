package com.safe.dto;

import com.safe.model.RankingModel;

import java.math.BigDecimal;

public class RankingResponseDTO {

    private Integer id;
    private Integer idPostulante;
    private BigDecimal promedioFinal;

    public RankingResponseDTO(RankingModel ranking) {
        this.id = ranking.getId();
        this.idPostulante = ranking.getIdPostulante();
        this.promedioFinal = ranking.getPromedioFinal();
    }

    public Integer getId() {
        return id;
    }

    public Integer getIdPostulante() {
        return idPostulante;
    }

    public BigDecimal getPromedioFinal() {
        return promedioFinal;
    }
}
