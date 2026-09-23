package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.AsignaturaPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.services.AsignaturaPracticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaturas-practica")
public class AsignaturaPracticaController {

    @Autowired
    private AsignaturaPracticaService asignaturaService;

    @GetMapping
    public List<AsignaturaPractica> listar() {
        return asignaturaService.listarTodos();
    }

    @PostMapping
    public AsignaturaPractica guardar(@RequestBody AsignaturaPractica asignatura) {
        return asignaturaService.guardar(asignatura);
    }

    @GetMapping("/{id}")
    public AsignaturaPractica buscarPorId(@PathVariable Long id) {
        return asignaturaService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        asignaturaService.eliminar(id);
    }
}