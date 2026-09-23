package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Estudiante;
import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.EstudianteRepository;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.PlanificacionRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlanificacionService {

    private final PlanificacionRepository planificacionRepository;
    private final EstudianteRepository estudianteRepository;
    private final String UPLOAD_DIR = "uploads/";

    public PlanificacionService(PlanificacionRepository planificacionRepository, EstudianteRepository estudianteRepository) {
        this.planificacionRepository = planificacionRepository;
        this.estudianteRepository = estudianteRepository;
    }

    // === VALIDACIÓN ESTRUCTURAL CON APACHE PDFBOX ===
    public List<String> validarEstructuraPDF(MultipartFile archivo) {
        List<String> faltantes = new ArrayList<>();

        try (PDDocument document = PDDocument.load(archivo.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String texto = stripper.getText(document).toLowerCase().replaceAll("\\s+", " ");

            // 1. Validar que contenga texto procesable mínimo
            if (texto.trim().isEmpty() || texto.length() < 150) {
                faltantes.add("documentoVacio");
                return faltantes;
            }

            // 2. Extracción de secciones delimitadas por encabezados
            String contenidoObjetivo = extraerTextoEntre(texto, "objetivo de la clase", "fecha");
            String contenidoRecursos = extraerTextoEntre(texto, "recursos didácticos", "evaluación");
            String contenidoDUA = extraerTextoEntre(texto, "principios dua", "momentos de la clase");
            String contenidoInicio = extraerTextoEntre(texto, "inicio (", "desarrollo (");
            String contenidoDesarrollo = extraerTextoEntre(texto, "desarrollo (", "cierre (");
            String contenidoCierre = extraerTextoEntre(texto, "cierre (", "errores y dificultades");

            // 3. Verificación de longitud mínima por campo
            if (contenidoObjetivo.length() < 15) {
                faltantes.add("objetivo");
            }
            if (contenidoRecursos.length() < 5) {
                faltantes.add("recursos");
            }
            if (contenidoDUA.length() < 20) {
                faltantes.add("inclusionDUA");
            }
            if (contenidoInicio.length() < 20) {
                faltantes.add("inicio");
            }
            if (contenidoDesarrollo.length() < 30) {
                faltantes.add("desarrollo");
            }
            if (contenidoCierre.length() < 20) {
                faltantes.add("cierre");
            }

            // 4. Si faltan 3 o más secciones esenciales, es plantilla vacía
            if (faltantes.size() >= 3) {
                faltantes.clear();
                faltantes.add("plantillaVacia");
            }

        } catch (IOException e) {
            faltantes.add("errorLectura");
        }

        return faltantes;
    }

    private String extraerTextoEntre(String textoCompleto, String etiquetaInicio, String etiquetaFin) {
        int idxInicio = textoCompleto.indexOf(etiquetaInicio);
        if (idxInicio == -1) return "";

        int startPos = idxInicio + etiquetaInicio.length();
        int idxFin = (etiquetaFin != null) ? textoCompleto.indexOf(etiquetaFin, startPos) : textoCompleto.length();

        if (idxFin == -1 || idxFin <= startPos) {
            return "";
        }

        return textoCompleto.substring(startPos, idxFin).trim();
    }

    // === PERSISTENCIA FÍSICA Y EN BASE DE DATOS ===
    @Transactional
    public Planificacion guardarPlanificacion(MultipartFile archivo, Long estudianteId) throws IOException {
        Path directorioPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(directorioPath)) {
            Files.createDirectories(directorioPath);
        }

        String nombreOriginal = archivo.getOriginalFilename();
        Path rutaCompleta = Paths.get(UPLOAD_DIR + nombreOriginal);
        Files.write(rutaCompleta, archivo.getBytes());

        Estudiante estudiante = estudianteRepository.findById(estudianteId).orElse(null);

        Planificacion planificacion = new Planificacion();
        planificacion.setTitulo(nombreOriginal != null ? nombreOriginal : "Planificación sin título");
        planificacion.setRutaDocumento(rutaCompleta.toString());
        planificacion.setEstudiante(estudiante);

        return planificacionRepository.save(planificacion);
    }

    // === MÉTODOS CRUD ===
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

    @Transactional(readOnly = true)
    public List<Planificacion> obtenerPorEstudiante(Long estudianteId) {
        return planificacionRepository.findByEstudianteId(estudianteId);
    }

    @Transactional
    public void eliminar(Long id) {
        planificacionRepository.deleteById(id);
    }
}