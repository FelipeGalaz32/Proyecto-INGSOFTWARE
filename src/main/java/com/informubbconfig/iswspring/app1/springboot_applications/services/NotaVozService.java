package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.NotaVoz;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.NotaVozRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotaVozService {

    @Autowired
    private NotaVozRepository notaVozRepository;

    @Transactional(readOnly = true)
    public List<NotaVoz> listarTodos() {
        return notaVozRepository.findAll();
    }

    @Transactional
    public NotaVoz guardar(NotaVoz notaVoz) {
        return notaVozRepository.save(notaVoz);
    }

    @Transactional(readOnly = true)
    public NotaVoz buscarPorId(Long id) {
        return notaVozRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        notaVozRepository.deleteById(id);
    }
}