package com.safe.repository;

import com.safe.model.EvaluacionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluacionRepository extends JpaRepository<EvaluacionModel, Integer> {
    // Hereda todos los métodos CRUD básicos, incluido .save()
}