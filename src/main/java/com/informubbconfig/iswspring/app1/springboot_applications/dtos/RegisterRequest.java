package com.informubbconfig.iswspring.app1.springboot_applications.dtos;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String rol; // "ESTUDIANTE", "PROFESOR", "TUTOR", "COORDINADOR", "COLABORADOR"
    private String rut;
}