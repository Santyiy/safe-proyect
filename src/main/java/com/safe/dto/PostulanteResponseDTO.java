package com.safe.dto;

import com.safe.model.PostulanteModel;

public class PostulanteResponseDTO {

    private Long id;

    private String telefono;
    private String direccion;
    private String fechaNacimiento;
    private String estadoCivil;
    private String experienciaLaboral;
    private String estudios;
    private String infoMedica;
    private String cvUrl;
    private String aptoMedicoUrl;

    // datos del usuario
    private String nombre;
    private String email;
    private String dni;

    public PostulanteResponseDTO(PostulanteModel postulante) {
        this.id = postulante.getId();
        this.telefono = postulante.getTelefono();
        this.direccion = postulante.getDireccion();
        this.fechaNacimiento = postulante.getFechaNacimiento();
        this.estadoCivil = postulante.getEstadoCivil();
        this.experienciaLaboral = postulante.getExperienciaLaboral();
        this.estudios = postulante.getEstudios();
        this.infoMedica = postulante.getInfoMedica();
        this.cvUrl = postulante.getCvUrl();
        this.aptoMedicoUrl = postulante.getAptoMedicoUrl();

        if (postulante.getUsuario() != null) {
            this.nombre = postulante.getUsuario().getNombre();
            this.email = postulante.getUsuario().getEmail();
            this.dni = postulante.getUsuario().getDni();
        }
    }

    // getters y setters

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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }
}
