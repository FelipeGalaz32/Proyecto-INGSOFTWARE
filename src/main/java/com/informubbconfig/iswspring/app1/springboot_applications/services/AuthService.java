package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.dtos.AuthResponse;
import com.informubbconfig.iswspring.app1.springboot_applications.dtos.LoginRequest;
import com.informubbconfig.iswspring.app1.springboot_applications.dtos.RegisterRequest;
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
    private ProfesorAsignaturaRepository profesorAsignaturaRepository;

    @Autowired
    private TutorUniversidadRepository tutorUniversidadRepository;

    @Autowired
    private CoordinadorPracticaRepository coordinadorPracticaRepository;

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    public AuthResponse login(LoginRequest request) {
        // 1. Estudiante
        Optional<Estudiante> estudiante = estudianteRepository.findByEmail(request.getEmail());
        if (estudiante.isPresent() && estudiante.get().getContrasena().equals(request.getPassword())) {
            Estudiante e = estudiante.get();
            return new AuthResponse(true, "Login exitoso", e.getEmail(), "ESTUDIANTE", e.getId(), e.getNombre() + " " + e.getApellido(), null);
        }

        // 2. ProfesorAsignatura
        Optional<ProfesorAsignatura> prof = profesorAsignaturaRepository.findByEmail(request.getEmail());
        if (prof.isPresent() && prof.get().getContrasena().equals(request.getPassword())) {
            ProfesorAsignatura p = prof.get();
            return new AuthResponse(true, "Login exitoso", p.getEmail(), "PROFESOR_ASIGNATURA", p.getId(), p.getNombre() + " " + p.getApellido(), null);
        }

        // 3. TutorUniversidad
        Optional<TutorUniversidad> tutor = tutorUniversidadRepository.findByEmail(request.getEmail());
        if (tutor.isPresent() && tutor.get().getContrasena().equals(request.getPassword())) {
            TutorUniversidad t = tutor.get();
            return new AuthResponse(true, "Login exitoso", t.getEmail(), "TUTOR_UNIVERSIDAD", t.getId(), t.getNombre() + " " + t.getApellido(), null);
        }

        // 4. CoordinadorPractica
        Optional<CoordinadorPractica> coord = coordinadorPracticaRepository.findByEmail(request.getEmail());
        if (coord.isPresent() && coord.get().getContrasena().equals(request.getPassword())) {
            CoordinadorPractica c = coord.get();
            return new AuthResponse(true, "Login exitoso", c.getEmail(), "COORDINADOR_PRACTICA", c.getId(), c.getNombre() + " " + c.getApellido(), null);
        }

        // 5. Colaborador
        Optional<Colaborador> colab = colaboradorRepository.findByEmail(request.getEmail());
        if (colab.isPresent() && colab.get().getPassword().equals(request.getPassword())) {
            Colaborador c = colab.get();
            return new AuthResponse(true, "Login exitoso", c.getEmail(), "COLABORADOR", c.getId(), c.getNombre() + " " + c.getApellido(), c.getColegio());
        }

        return new AuthResponse(false, "Credenciales incorrectas", null, null, null, null, null);
    }

    public AuthResponse registrar(RegisterRequest request) {
        if (request.getRol() == null) {
            return new AuthResponse(false, "Rol no especificado", null, null, null, null, null);
        }

        String rol = request.getRol().trim();

        switch (rol) {
            case "ESTUDIANTE":
            case "Estudiante":
                if (estudianteRepository.findByEmail(request.getEmail()).isPresent()) {
                    return new AuthResponse(false, "El correo ya está registrado", null, null, null, null, null);
                }
                Estudiante est = new Estudiante();
                est.setNombre(request.getNombre());
                est.setApellido(request.getApellido());
                est.setEmail(request.getEmail());
                est.setContrasena(request.getPassword());
                est.setRut(request.getRut());
                estudianteRepository.save(est);
                return new AuthResponse(true, "Estudiante registrado con éxito", est.getEmail(), "ESTUDIANTE", est.getId(), est.getNombre() + " " + est.getApellido(), null);

            case "PROFESOR_ASIGNATURA":
            case "Profesor de Asignatura":
                if (profesorAsignaturaRepository.findByEmail(request.getEmail()).isPresent()) {
                    return new AuthResponse(false, "El correo ya está registrado", null, null, null, null, null);
                }
                ProfesorAsignatura prof = new ProfesorAsignatura();
                prof.setNombre(request.getNombre());
                prof.setApellido(request.getApellido());
                prof.setEmail(request.getEmail());
                prof.setContrasena(request.getPassword());
                prof.setRut(request.getRut());
                profesorAsignaturaRepository.save(prof);
                return new AuthResponse(true, "Profesor registrado con éxito", prof.getEmail(), "PROFESOR_ASIGNATURA", prof.getId(), prof.getNombre() + " " + prof.getApellido(), null);

            case "TUTOR_UNIVERSIDAD":
            case "Tutor Universidad":
                if (tutorUniversidadRepository.findByEmail(request.getEmail()).isPresent()) {
                    return new AuthResponse(false, "El correo ya está registrado", null, null, null, null, null);
                }
                TutorUniversidad tutor = new TutorUniversidad();
                tutor.setNombre(request.getNombre());
                tutor.setApellido(request.getApellido());
                tutor.setEmail(request.getEmail());
                tutor.setContrasena(request.getPassword());
                tutor.setRut(request.getRut());
                tutorUniversidadRepository.save(tutor);
                return new AuthResponse(true, "Tutor registrado con éxito", tutor.getEmail(), "TUTOR_UNIVERSIDAD", tutor.getId(), tutor.getNombre() + " " + tutor.getApellido(), null);

            case "COORDINADOR_PRACTICA":
            case "Coordinador de Práctica":
                if (coordinadorPracticaRepository.findByEmail(request.getEmail()).isPresent()) {
                    return new AuthResponse(false, "El correo ya está registrado", null, null, null, null, null);
                }
                CoordinadorPractica coord = new CoordinadorPractica();
                coord.setNombre(request.getNombre());
                coord.setApellido(request.getApellido());
                coord.setEmail(request.getEmail());
                coord.setContrasena(request.getPassword());
                coord.setRut(request.getRut());
                coordinadorPracticaRepository.save(coord);
                return new AuthResponse(true, "Coordinador registrado con éxito", coord.getEmail(), "COORDINADOR_PRACTICA", coord.getId(), coord.getNombre() + " " + coord.getApellido(), null);

            case "COLABORADOR":
            case "Profesor Colaborador":
                if (colaboradorRepository.findByEmail(request.getEmail()).isPresent()) {
                    return new AuthResponse(false, "El correo ya está registrado", null, null, null, null, null);
                }
                Colaborador colab = new Colaborador();
                colab.setNombre(request.getNombre());
                colab.setApellido(request.getApellido());
                colab.setEmail(request.getEmail());
                colab.setPassword(request.getPassword());
                colab.setRut(request.getRut());
                colab.setColegio(request.getColegio());
                colaboradorRepository.save(colab);
                return new AuthResponse(true, "Colaborador registrado con éxito", colab.getEmail(), "COLABORADOR", colab.getId(), colab.getNombre() + " " + colab.getApellido(), colab.getColegio());

            default:
                return new AuthResponse(false, "Rol no válido", null, null, null, null, null);
        }
    }
}