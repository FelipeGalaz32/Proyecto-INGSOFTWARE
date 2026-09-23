package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.CoordinadorPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.services.CoordinadorPracticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinadores-practica")
public class CoordinadorPracticaController {

    @Autowired
    private CoordinadorPracticaService coordinadorService;

    @GetMapping
    public List<CoordinadorPractica> listar() {
        return coordinadorService.listarTodos();
    }

    @PostMapping
    public CoordinadorPractica guardar(@RequestBody CoordinadorPractica coordinador) {
        return coordinadorService.guardar(coordinador);
    }

    @GetMapping("/{id}")
    public CoordinadorPractica buscarPorId(@PathVariable Long id) {
        return coordinadorService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        coordinadorService.eliminar(id);
    }
}