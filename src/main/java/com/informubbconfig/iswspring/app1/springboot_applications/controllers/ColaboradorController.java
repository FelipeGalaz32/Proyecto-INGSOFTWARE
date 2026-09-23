package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Colaborador;
import com.informubbconfig.iswspring.app1.springboot_applications.services.ColaboradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colaboradores")
public class ColaboradorController {

    @Autowired
    private ColaboradorService colaboradorService;

    @GetMapping
    public List<Colaborador> listar() {
        return colaboradorService.listarTodos();
    }

    @PostMapping
    public Colaborador guardar(@RequestBody Colaborador colaborador) {
        return colaboradorService.guardar(colaborador);
    }

    @GetMapping("/{id}")
    public Colaborador buscarPorId(@PathVariable Long id) {
        return colaboradorService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        colaboradorService.eliminar(id);
    }
}