package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pautas_evaluacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PautaEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double nota;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    // Relación N:1 con InscripcionPractica
    @ManyToOne
    @JoinColumn(name = "inscripcion_practica_id")
    private InscripcionPractica inscripcionPractica;

    // Relación N:1 con Colaborador
    @ManyToOne
    @JoinColumn(name = "colaborador_id")
    private Colaborador colaborador;

    // Relación N:1 con TutorUniversidad
    @ManyToOne
    @JoinColumn(name = "tutor_universidad_id")
    private TutorUniversidad tutorUniversidad;

    // Relación 1:1 con NotaVoz
    @OneToOne
    @JoinColumn(name = "nota_voz_id")
    private NotaVoz notaVoz;
}