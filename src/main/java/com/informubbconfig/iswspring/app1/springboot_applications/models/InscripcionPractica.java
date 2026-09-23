package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inscripciones_practica")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscripcionPractica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String periodo; // Ejemplo: "2026-1"

    // Relación N:1 con Estudiante
    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    // Relación N:1 con AsignaturaPractica
    @ManyToOne
    @JoinColumn(name = "asignatura_practica_id")
    private AsignaturaPractica asignaturaPractica;
}