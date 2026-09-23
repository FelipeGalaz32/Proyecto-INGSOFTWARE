package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profesores_asignatura")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfesorAsignatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String rut;
}