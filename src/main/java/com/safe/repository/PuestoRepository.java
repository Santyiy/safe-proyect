package com.safe.repository;

import com.safe.model.PuestoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuestoRepository extends JpaRepository<PuestoModel, Long> {
}
