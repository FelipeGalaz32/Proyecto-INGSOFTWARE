package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.AsignaturaPractica;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.AsignaturaPracticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AsignaturaPracticaService {

    @Autowired
    private AsignaturaPracticaRepository asignaturaRepository;

    @Transactional(readOnly = true)
    public List<AsignaturaPractica> listarTodos() {
        return asignaturaRepository.findAll();
    }

    @Transactional
    public AsignaturaPractica guardar(AsignaturaPractica asignatura) {
        return asignaturaRepository.save(asignatura);
    }

    @Transactional(readOnly = true)
    public AsignaturaPractica buscarPorId(Long id) {
        return asignaturaRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        asignaturaRepository.deleteById(id);
    }
}