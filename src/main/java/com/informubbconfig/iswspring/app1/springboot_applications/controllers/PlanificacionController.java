package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.services.PlanificacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/planificaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PlanificacionController {

    private final PlanificacionService planificacionService;

    public PlanificacionController(PlanificacionService planificacionService) {
        this.planificacionService = planificacionService;
    }

    @GetMapping
    public List<Planificacion> listar() {
        return planificacionService.listarTodos();
    }

    // Subida asociada a un estudiante específico
    @PostMapping("/subir/{estudianteId}")
    public ResponseEntity<Map<String, Object>> subirPlanificacionConId(
            @PathVariable Long estudianteId,
            @RequestParam("archivo") MultipartFile archivo) {
        return procesarSubidaYValidacion(archivo, estudianteId);
    }

    // Subida general con parámetro opcional de estudiante
    @PostMapping("/subir")
    public ResponseEntity<Map<String, Object>> subirPlanificacionGeneral(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(value = "estudianteId", required = false) Long estudianteId) {
        Long idFinal = (estudianteId != null) ? estudianteId : 1L;
        return procesarSubidaYValidacion(archivo, idFinal);
    }

    // Flujo centralizado de validación y almacenamiento (aplica tanto a nueva subida como a reemplazo)
    private ResponseEntity<Map<String, Object>> procesarSubidaYValidacion(MultipartFile archivo, Long estudianteId) {
        Map<String, Object> respuesta = new HashMap<>();

        if (archivo == null || archivo.isEmpty()) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "El archivo enviado está vacío o no se seleccionó ninguno.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // 1. Validar el contenido con PDFBox en memoria
        List<String> faltantes = planificacionService.validarEstructuraPDF(archivo);

        // Archivo dañado o sin texto extraíble
        if (faltantes.contains("documentoVacio") || faltantes.contains("errorLectura")) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "El archivo está vacío, dañado o no contiene texto legible (no es una planificación válida).");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // Plantilla sin rellenar
        if (faltantes.contains("plantillaVacia")) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "El archivo corresponde a una plantilla vacía. No es una planificación válida.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // Faltan secciones clave -> NO se guarda en disco ni en BD
        if (!faltantes.isEmpty()) {
            respuesta.put("exito", false);
            respuesta.put("elementosFaltantes", faltantes);
            respuesta.put("mensaje", "El documento no cumple con los requisitos obligatorios de la planificación.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // 2. Documento válido -> Se almacena físicamente y se registra en MySQL vinculado al estudiante
        try {
            Planificacion guardada = planificacionService.guardarPlanificacion(archivo, estudianteId);
            respuesta.put("exito", true);
            respuesta.put("elementosFaltantes", List.of());
            respuesta.put("planificacion", guardada);
            respuesta.put("mensaje", "Planificación validada y cargada exitosamente a la plataforma.");
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (Exception e) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "Error interno al registrar el archivo en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    @PostMapping
    public Planificacion guardar(@RequestBody Planificacion planificacion) {
        return planificacionService.guardar(planificacion);
    }

    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<Planificacion>> listarPorEstudiante(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(planificacionService.obtenerPorEstudiante(estudianteId));
    }

    @GetMapping("/{id}")
    public Planificacion buscarPorId(@PathVariable Long id) {
        return planificacionService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        planificacionService.eliminar(id);
    }
}