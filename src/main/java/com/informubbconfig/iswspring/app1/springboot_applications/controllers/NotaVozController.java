package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.NotaVoz;
import com.informubbconfig.iswspring.app1.springboot_applications.services.NotaVozService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas-voz")
public class NotaVozController {

    @Autowired
    private NotaVozService notaVozService;

    @GetMapping
    public List<NotaVoz> listar() {
        return notaVozService.listarTodos();
    }

    @PostMapping
    public NotaVoz guardar(@RequestBody NotaVoz notaVoz) {
        return notaVozService.guardar(notaVoz);
    }

    @GetMapping("/{id}")
    public NotaVoz buscarPorId(@PathVariable Long id) {
        return notaVozService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        notaVozService.eliminar(id);
    }
}