package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "asignaturas_practica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsignaturaPractica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String codigo;

    // Relación N:1 con ProfesorAsignatura
    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private ProfesorAsignatura profesorAsignatura;

    // Relación N:1 con CoordinadorPractica
    @ManyToOne
    @JoinColumn(name = "coordinador_id")
    private CoordinadorPractica coordinadorPractica;
}