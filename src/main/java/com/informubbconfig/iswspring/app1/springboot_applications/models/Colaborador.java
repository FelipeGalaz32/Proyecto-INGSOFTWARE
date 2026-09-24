package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "colaboradores")
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(unique = true, nullable = false)
    private String rut;

    @Column(nullable = true)
    private String colegio;
}