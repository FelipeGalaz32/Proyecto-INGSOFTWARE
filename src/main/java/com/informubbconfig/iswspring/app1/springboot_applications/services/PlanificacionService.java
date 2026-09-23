package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Planificacion;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.PlanificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PlanificacionService {

    @Autowired
    private PlanificacionRepository planificacionRepository;

    // === MÉTODO NUEVO PARA HU-07 ===
    public String guardarArchivo(MultipartFile archivo) throws IOException {
        // Creamos una carpeta llamada "uploads" en la raíz del proyecto
        String carpetaDestino = "uploads//";
        Path directorioPath = Paths.get(carpetaDestino);

        if (!Files.exists(directorioPath)) {
            Files.createDirectories(directorioPath);
        }

        // Creamos la ruta completa con el nombre original del archivo
        byte[] bytes = archivo.getBytes();
        Path rutaCompleta = Paths.get(carpetaDestino + archivo.getOriginalFilename());

        // Guardamos el archivo en el disco duro
        Files.write(rutaCompleta, bytes);

        // Retornamos la ruta para guardarla en la base de datos
        return rutaCompleta.toString();
    }

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