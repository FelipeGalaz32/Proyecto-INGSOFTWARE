package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.TutorUniversidad;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.TutorUniversidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TutorUniversidadService {

    @Autowired
    private TutorUniversidadRepository tutorRepository;

    @Transactional(readOnly = true)
    public List<TutorUniversidad> listarTodos() {
        return tutorRepository.findAll();
    }

    @Transactional
    public TutorUniversidad guardar(TutorUniversidad tutor) {
        return tutorRepository.save(tutor);
    }

    @Transactional(readOnly = true)
    public TutorUniversidad buscarPorId(Long id) {
        return tutorRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        tutorRepository.deleteById(id);
    }
}