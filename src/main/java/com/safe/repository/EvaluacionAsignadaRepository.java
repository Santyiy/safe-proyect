package com.safe.repository;

import com.safe.model.EvaluacionAsignadaModel;
import com.safe.model.PostulanteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionAsignadaRepository extends JpaRepository<EvaluacionAsignadaModel, Long> {

    List<EvaluacionAsignadaModel> findByPostulanteOrderByFechaDescHoraInicioDesc(PostulanteModel postulante);
}
