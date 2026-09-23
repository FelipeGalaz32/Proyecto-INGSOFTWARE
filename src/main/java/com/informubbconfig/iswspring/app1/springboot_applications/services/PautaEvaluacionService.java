package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.PautaEvaluacion;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.PautaEvaluacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PautaEvaluacionService {

    @Autowired
    private PautaEvaluacionRepository pautaRepository;

    @Transactional(readOnly = true)
    public List<PautaEvaluacion> listarTodos() {
        return pautaRepository.findAll();
    }

    @Transactional
    public PautaEvaluacion guardar(PautaEvaluacion pauta) {
        return pautaRepository.save(pauta);
    }

    @Transactional(readOnly = true)
    public PautaEvaluacion buscarPorId(Long id) {
        return pautaRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        pautaRepository.deleteById(id);
    }
}