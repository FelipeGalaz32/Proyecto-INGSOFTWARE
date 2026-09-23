package com.informubbconfig.iswspring.app1.springboot_applications.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean exito;
    private String mensaje;
    private String email;
    private String rol;
    private Long idUsuario;
}