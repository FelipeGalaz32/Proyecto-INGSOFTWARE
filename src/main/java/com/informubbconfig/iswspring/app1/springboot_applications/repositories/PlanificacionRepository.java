package com.informubbconfig.iswspring.app1.springboot_applications.repositories;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanificacionRepository extends JpaRepository<Planificacion, Long> {
}