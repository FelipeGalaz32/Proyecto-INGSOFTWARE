package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.PlanificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlanificacionService {

    @Autowired
    private PlanificacionRepository planificacionRepository;

    @Transactional(readOnly = true)
    public List<Planificacion> listarTodos() {
        return planificacionRepository.findAll();
    }

    @Transactional
    public Planificacion guardar(Planificacion planificacion) {
        return planificacionRepository.save(planificacion);
    }

    @Transactional(readOnly = true)
    public Planificacion buscarPorId(Long id) {
        return planificacionRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        planificacionRepository.deleteById(id);
    }
}