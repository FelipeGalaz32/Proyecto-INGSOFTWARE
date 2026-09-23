package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.ProfesorAsignatura;
import com.informubbconfig.iswspring.app1.springboot_applications.services.ProfesorAsignaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesores-asignatura")
public class ProfesorAsignaturaController {

    @Autowired
    private ProfesorAsignaturaService profesorService;

    @GetMapping
    public List<ProfesorAsignatura> listar() {
        return profesorService.listarTodos();
    }

    @PostMapping
    public ProfesorAsignatura guardar(@RequestBody ProfesorAsignatura profesor) {
        return profesorService.guardar(profesor);
    }

    @GetMapping("/{id}")
    public ProfesorAsignatura buscarPorId(@PathVariable Long id) {
        return profesorService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        profesorService.eliminar(id);
    }
}