package com.informubbconfig.iswspring.app1.springboot_applications.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private boolean exito;
    private String mensaje;
    private String email;
    private String rol;
    private Long idUsuario;
    private String nombre;
    private String colegio;

    // Constructor de conveniencia para casos donde no aplica el campo colegio/nombre
    public AuthResponse(boolean exito, String mensaje, String email, String rol, Long idUsuario) {
        this.exito = exito;
        this.mensaje = mensaje;
        this.email = email;
        this.rol = rol;
        this.idUsuario = idUsuario;
    }

    public AuthResponse(boolean exito, String mensaje, String email, String rol, Long idUsuario, String nombre) {
        this.exito = exito;
        this.mensaje = mensaje;
        this.email = email;
        this.rol = rol;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
    }
}