package com.informubbconfig.iswspring.app1.springboot_applications.repositories;

import com.informubbconfig.iswspring.app1.springboot_applications.models.PautaEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PautaEvaluacionRepository extends JpaRepository<PautaEvaluacion, Long> {
}