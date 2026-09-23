package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.services.PlanificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planificaciones")
public class PlanificacionController {

    @Autowired
    private PlanificacionService planificacionService;

    @GetMapping
    public List<Planificacion> listar() {
        return planificacionService.listarTodos();
    }

    @PostMapping
    public Planificacion guardar(@RequestBody Planificacion planificacion) {
        return planificacionService.guardar(planificacion);
    }

    @GetMapping("/{id}")
    public Planificacion buscarPorId(@PathVariable Long id) {
        return planificacionService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        planificacionService.eliminar(id);
    }
}