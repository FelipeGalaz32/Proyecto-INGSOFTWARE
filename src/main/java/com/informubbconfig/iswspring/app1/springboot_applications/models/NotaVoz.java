package com.informubbconfig.iswspring.app1.springboot_applications.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notas_voz")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaVoz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String urlArchivo;

    @Column(columnDefinition = "TEXT")
    private String transcripcion;
}