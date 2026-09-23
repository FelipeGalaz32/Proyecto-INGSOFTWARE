package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Estudiante;
import com.informubbconfig.iswspring.app1.springboot_applications.services.EstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "http://localhost:5173")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    // GET: http://localhost:8080/api/estudiantes
    @GetMapping
    public List<Estudiante> listar() {
        return estudianteService.listarTodos();
    }

    // POST: http://localhost:8080/api/estudiantes
    @PostMapping
    public Estudiante guardar(@RequestBody Estudiante estudiante) {
        return estudianteService.guardar(estudiante);
    }

    // GET: http://localhost:8080/api/estudiantes/1
    @GetMapping("/{id}")
    public Estudiante buscarPorId(@PathVariable Long id) {
        return estudianteService.buscarPorId(id);
    }

    // DELETE: http://localhost:8080/api/estudiantes/1
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
    }
}