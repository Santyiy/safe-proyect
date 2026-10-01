package com.safe.repository;

import com.safe.model.PreguntaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<PreguntaModel, Long> {

    List<PreguntaModel> findByEvaluacionIdOrderByIdAsc(Integer idEvaluacion);
}
