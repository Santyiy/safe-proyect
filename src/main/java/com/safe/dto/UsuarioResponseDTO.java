package com.safe.dto;

public class UsuarioResponseDTO {

    private Long id;
    private String dni;
    private String nombre;
    private String email;
    private String rol;

    public UsuarioResponseDTO(Long id, String dni, String nombre, String email, String rol) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public String getDni() { return dni; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
}
