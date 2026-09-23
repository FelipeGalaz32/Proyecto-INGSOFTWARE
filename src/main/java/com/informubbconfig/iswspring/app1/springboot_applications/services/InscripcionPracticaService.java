package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.InscripcionPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.InscripcionPracticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InscripcionPracticaService {

    @Autowired
    private InscripcionPracticaRepository inscripcionRepository;

    @Transactional(readOnly = true)
    public List<InscripcionPractica> listarTodos() {
        return inscripcionRepository.findAll();
    }

    @Transactional
    public InscripcionPractica guardar(InscripcionPractica inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    @Transactional(readOnly = true)
    public InscripcionPractica buscarPorId(Long id) {
        return inscripcionRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        inscripcionRepository.deleteById(id);
    }
}