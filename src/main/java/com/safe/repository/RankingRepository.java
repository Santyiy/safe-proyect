package com.safe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.safe.model.RankingModel;

import java.util.List;

public interface RankingRepository extends JpaRepository<RankingModel, Integer> {
    @Query("SELECT r FROM Ranking r ORDER BY r.promedioFinal DESC")
    List<RankingModel> findAllOrderByPromedio();
}