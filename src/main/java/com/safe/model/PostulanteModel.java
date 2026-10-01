package com.safe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "postulante")
public class PostulanteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String telefono;

    private String direccion;

    private String fechaNacimiento;

    private String estadoCivil;

    @Column(length = 2000)
    private String experienciaLaboral;

    @Column(length = 2000)
    private String estudios;

    @Column(length = 2000)
    private String infoMedica;

    private String cvUrl;

    private String aptoMedicoUrl;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

    // GETTERS Y SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public String getExperienciaLaboral() {
        return experienciaLaboral;
    }

    public void setExperienciaLaboral(String experienciaLaboral) {
        this.experienciaLaboral = experienciaLaboral;
    }

    public String getEstudios() {
        return estudios;
    }

    public void setEstudios(String estudios) {
        this.estudios = estudios;
    }

    public String getInfoMedica() {
        return infoMedica;
    }

    public void setInfoMedica(String infoMedica) {
        this.infoMedica = infoMedica;
    }

    public String getCvUrl() {
        return cvUrl;
    }

    public void setCvUrl(String cvUrl) {
        this.cvUrl = cvUrl;
    }

    public String getAptoMedicoUrl() {
        return aptoMedicoUrl;
    }

    public void setAptoMedicoUrl(String aptoMedicoUrl) {
        this.aptoMedicoUrl = aptoMedicoUrl;
    }

    public UsuarioModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioModel usuario) {
        this.usuario = usuario;
    }
}