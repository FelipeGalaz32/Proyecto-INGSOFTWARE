package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.dtos.*;
import com.informubbconfig.iswspring.app1.springboot_applications.models.*;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private ProfesorAsignaturaRepository profesorRepository;

    @Autowired
    private TutorUniversidadRepository tutorRepository;

    @Autowired
    private CoordinadorPracticaRepository coordinadorRepository;

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail();
        String pass = request.getPassword();

        // Estudiante
        Optional<Estudiante> estudiante = estudianteRepository.findAll().stream()
                .filter(e -> email.equalsIgnoreCase(e.getEmail()) && pass.equals(e.getContrasena()))
                .findFirst();
        if (estudiante.isPresent()) {
            return new AuthResponse(true, "Login exitoso como Estudiante", email, "ESTUDIANTE", estudiante.get().getId());
        }

        // Profesor
        Optional<ProfesorAsignatura> profesor = profesorRepository.findAll().stream()
                .filter(p -> email.equalsIgnoreCase(p.getEmail()) && pass.equals(p.getContrasena()))
                .findFirst();
        if (profesor.isPresent()) {
            return new AuthResponse(true, "Login exitoso como Profesor", email, "PROFESOR", profesor.get().getId());
        }

        // Tutor
        Optional<TutorUniversidad> tutor = tutorRepository.findAll().stream()
                .filter(t -> email.equalsIgnoreCase(t.getEmail()) && pass.equals(t.getContrasena()))
                .findFirst();
        if (tutor.isPresent()) {
            return new AuthResponse(true, "Login exitoso como Tutor", email, "TUTOR", tutor.get().getId());
        }

        // Coordinador
        Optional<CoordinadorPractica> coord = coordinadorRepository.findAll().stream()
                .filter(c -> email.equalsIgnoreCase(c.getEmail()) && pass.equals(c.getContrasena()))
                .findFirst();
        if (coord.isPresent()) {
            return new AuthResponse(true, "Login exitoso como Coordinador", email, "COORDINADOR", coord.get().getId());
        }

        // Colaborador
        Optional<Colaborador> colab = colaboradorRepository.findAll().stream()
                .filter(c -> email.equalsIgnoreCase(c.getEmail()) && pass.equals(c.getContrasena()))
                .findFirst();
        if (colab.isPresent()) {
            return new AuthResponse(true, "Login exitoso como Colaborador", email, "COLABORADOR", colab.get().getId());
        }

        return new AuthResponse(false, "Credenciales inválidas o usuario no encontrado", null, null, null);
    }

    public AuthResponse registrar(RegisterRequest request) {
        String rol = request.getRol().toUpperCase();

        switch (rol) {
            case "ESTUDIANTE":
                Estudiante e = new Estudiante();
                e.setNombre(request.getNombre());
                e.setApellido(request.getApellido());
                e.setEmail(request.getEmail());
                e.setContrasena(request.getPassword());
                e.setRut(request.getRut());
                e = estudianteRepository.save(e);
                return new AuthResponse(true, "Estudiante registrado correctamente", e.getEmail(), "ESTUDIANTE", e.getId());

            case "PROFESOR":
                ProfesorAsignatura p = new ProfesorAsignatura();
                p.setNombre(request.getNombre());
                p.setApellido(request.getApellido());
                p.setEmail(request.getEmail());
                p.setContrasena(request.getPassword());
                p.setRut(request.getRut());
                p = profesorRepository.save(p);
                return new AuthResponse(true, "Profesor registrado correctamente", p.getEmail(), "PROFESOR", p.getId());

            case "TUTOR":
                TutorUniversidad t = new TutorUniversidad();
                t.setNombre(request.getNombre());
                t.setApellido(request.getApellido());
                t.setEmail(request.getEmail());
                t.setContrasena(request.getPassword());
                t.setRut(request.getRut());
                t = tutorRepository.save(t);
                return new AuthResponse(true, "Tutor registrado correctamente", t.getEmail(), "TUTOR", t.getId());

            case "COORDINADOR":
                CoordinadorPractica c = new CoordinadorPractica();
                c.setNombre(request.getNombre());
                c.setApellido(request.getApellido());
                c.setEmail(request.getEmail());
                c.setContrasena(request.getPassword());
                c.setRut(request.getRut());
                c = coordinadorRepository.save(c);
                return new AuthResponse(true, "Coordinador registrado correctamente", c.getEmail(), "COORDINADOR", c.getId());

            default:
                return new AuthResponse(false, "Rol especificado no válido", null, null, null);
        }
    }
}