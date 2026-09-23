package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.ProfesorAsignatura;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.ProfesorAsignaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfesorAsignaturaService {

    @Autowired
    private ProfesorAsignaturaRepository profesorRepository;

    @Transactional(readOnly = true)
    public List<ProfesorAsignatura> listarTodos() {
        return profesorRepository.findAll();
    }

    @Transactional
    public ProfesorAsignatura guardar(ProfesorAsignatura profesor) {
        return profesorRepository.save(profesor);
    }

    @Transactional(readOnly = true)
    public ProfesorAsignatura buscarPorId(Long id) {
        return profesorRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        profesorRepository.deleteById(id);
    }
}