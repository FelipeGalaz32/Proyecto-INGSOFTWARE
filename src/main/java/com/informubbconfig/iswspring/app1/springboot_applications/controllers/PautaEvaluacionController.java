package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.PautaEvaluacion;
import com.informubbconfig.iswspring.app1.springboot_applications.services.PautaEvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pautas-evaluacion")
public class PautaEvaluacionController {

    @Autowired
    private PautaEvaluacionService pautaService;

    @GetMapping
    public List<PautaEvaluacion> listar() {
        return pautaService.listarTodos();
    }

    @PostMapping
    public PautaEvaluacion guardar(@RequestBody PautaEvaluacion pauta) {
        return pautaService.guardar(pauta);
    }

    @GetMapping("/{id}")
    public PautaEvaluacion buscarPorId(@PathVariable Long id) {
        return pautaService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        pautaService.eliminar(id);
    }
}