package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.TutorUniversidad;
import com.informubbconfig.iswspring.app1.springboot_applications.services.TutorUniversidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores-universidad")
public class TutorUniversidadController {

    @Autowired
    private TutorUniversidadService tutorService;

    @GetMapping
    public List<TutorUniversidad> listar() {
        return tutorService.listarTodos();
    }

    @PostMapping
    public TutorUniversidad guardar(@RequestBody TutorUniversidad tutor) {
        return tutorService.guardar(tutor);
    }

    @GetMapping("/{id}")
    public TutorUniversidad buscarPorId(@PathVariable Long id) {
        return tutorService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        tutorService.eliminar(id);
    }
}