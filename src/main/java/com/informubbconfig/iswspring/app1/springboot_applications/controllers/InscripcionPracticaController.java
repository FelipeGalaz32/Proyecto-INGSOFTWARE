package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.InscripcionPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.services.InscripcionPracticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones-practica")
public class InscripcionPracticaController {

    @Autowired
    private InscripcionPracticaService inscripcionService;

    @GetMapping
    public List<InscripcionPractica> listar() {
        return inscripcionService.listarTodos();
    }

    @PostMapping
    public InscripcionPractica guardar(@RequestBody InscripcionPractica inscripcion) {
        return inscripcionService.guardar(inscripcion);
    }

    @GetMapping("/{id}")
    public InscripcionPractica buscarPorId(@PathVariable Long id) {
        return inscripcionService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}