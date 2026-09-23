package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.services.PlanificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/planificaciones")
@CrossOrigin(origins = "http://localhost:5173") // Vital para que React se comunique sin problemas de CORS
public class PlanificacionController {

    @Autowired
    private PlanificacionService planificacionService;

    @GetMapping
    public List<Planificacion> listar() {
        return planificacionService.listarTodos();
    }

    @PostMapping
    public Planificacion guardar(@RequestBody Planificacion planificacion) {
        return planificacionService.guardar(planificacion);
    }

    // === ENDPOINT PARA LA HU-07: Subir la planificación en PDF ===
    @PostMapping("/subir")
    public ResponseEntity<String> subirPlanificacionPDF(@RequestParam("archivo") MultipartFile archivo) {

        if (archivo.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: No se ha adjuntado ningún documento.");
        }
        if (!"application/pdf".equals(archivo.getContentType())) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("Error: El archivo debe ser un formato PDF válido.");
        }

        try {
            // Guardamos el archivo utilizando el servicio
            String rutaGuardada = planificacionService.guardarArchivo(archivo);
            return ResponseEntity.ok("PDF subido con éxito y almacenado en: " + rutaGuardada);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el archivo: " + e.getMessage());
        }
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