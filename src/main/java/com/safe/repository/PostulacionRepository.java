package com.safe.repository;

import com.safe.model.PostulacionId;
import com.safe.model.PostulacionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulacionRepository extends JpaRepository<PostulacionModel, PostulacionId> {
    List<PostulacionModel> findByPostulanteId(Long idPostulante);
    List<PostulacionModel> findByPuestoId(Long idPuesto);
}