package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Colaborador;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.ColaboradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ColaboradorService {

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    @Transactional(readOnly = true)
    public List<Colaborador> listarTodos() {
        return colaboradorRepository.findAll();
    }

    @Transactional
    public Colaborador guardar(Colaborador colaborador) {
        return colaboradorRepository.save(colaborador);
    }

    @Transactional(readOnly = true)
    public Colaborador buscarPorId(Long id) {
        return colaboradorRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        colaboradorRepository.deleteById(id);
    }
}