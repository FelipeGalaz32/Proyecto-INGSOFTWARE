package com.informubbconfig.iswspring.app1.springboot_applications.repositories;

import com.informubbconfig.iswspring.app1.springboot_applications.models.CoordinadorPractica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoordinadorPracticaRepository extends JpaRepository<CoordinadorPractica, Long> {
    Optional<CoordinadorPractica> findByEmail(String email);
    Optional<CoordinadorPractica> findByRut(String rut);
}