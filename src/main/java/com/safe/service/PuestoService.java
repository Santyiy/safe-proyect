package com.safe.service;

import com.safe.dto.PuestoRequestDTO;
import com.safe.model.PuestoModel;
import com.safe.repository.PuestoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PuestoService {

    private final PuestoRepository puestoRepository;

    public PuestoService(PuestoRepository puestoRepository) {
        this.puestoRepository = puestoRepository;
    }

    public PuestoModel crear(PuestoRequestDTO dto) {
        validar(dto);

        PuestoModel puesto = new PuestoModel();
        cargarDatos(puesto, dto);

        return puestoRepository.save(puesto);
    }

    public List<PuestoModel> listar() {
        return puestoRepository.findAll();
    }

    public PuestoModel obtenerDetalle(Long id) {
        return puestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));
    }

    public PuestoModel actualizar(Long id, PuestoRequestDTO dto) {
        validar(dto);

        PuestoModel puesto = obtenerDetalle(id);
        cargarDatos(puesto, dto);

        return puestoRepository.save(puesto);
    }

    public void eliminar(Long id) {
        PuestoModel puesto = obtenerDetalle(id);
        puestoRepository.delete(puesto);
    }

    private void cargarDatos(PuestoModel puesto, PuestoRequestDTO dto) {
        puesto.setNombrePuesto(dto.getNombrePuesto().trim());
        puesto.setTipo(dto.getTipo().trim());
        puesto.setRequisitos(dto.getRequisitos().trim());
    }

    private void validar(PuestoRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del puesto son obligatorios");
        }

        if (estaVacio(dto.getNombrePuesto())) {
            throw new IllegalArgumentException("El nombre del puesto es obligatorio");
        }

        if (estaVacio(dto.getTipo())) {
            throw new IllegalArgumentException("El tipo de puesto es obligatorio");
        }

        if (estaVacio(dto.getRequisitos())) {
            throw new IllegalArgumentException("Los requisitos del puesto son obligatorios");
        }
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}
