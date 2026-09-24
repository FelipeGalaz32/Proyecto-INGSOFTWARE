package com.informubbconfig.iswspring.app1.springboot_applications.repositories;

import com.informubbconfig.iswspring.app1.springboot_applications.models.TutorUniversidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorUniversidadRepository extends JpaRepository<TutorUniversidad, Long> {
    Optional<TutorUniversidad> findByEmail(String email);
    Optional<TutorUniversidad> findByRut(String rut);
}