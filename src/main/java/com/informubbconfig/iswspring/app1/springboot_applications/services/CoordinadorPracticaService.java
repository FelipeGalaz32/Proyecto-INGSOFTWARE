package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.CoordinadorPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.CoordinadorPracticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CoordinadorPracticaService {

    @Autowired
    private CoordinadorPracticaRepository coordinadorRepository;

    @Transactional(readOnly = true)
    public List<CoordinadorPractica> listarTodos() {
        return coordinadorRepository.findAll();
    }

    @Transactional
    public CoordinadorPractica guardar(CoordinadorPractica coordinador) {
        return coordinadorRepository.save(coordinador);
    }

    @Transactional(readOnly = true)
    public CoordinadorPractica buscarPorId(Long id) {
        return coordinadorRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        coordinadorRepository.deleteById(id);
    }
}