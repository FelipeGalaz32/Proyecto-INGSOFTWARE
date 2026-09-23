package com.informubbconfig.iswspring.app1.springboot_applications.controllers;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Chatbot;
import com.informubbconfig.iswspring.app1.springboot_applications.services.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbots")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @GetMapping
    public List<Chatbot> listar() {
        return chatbotService.listarTodos();
    }

    @PostMapping
    public Chatbot guardar(@RequestBody Chatbot chatbot) {
        return chatbotService.guardar(chatbot);
    }

    @GetMapping("/{id}")
    public Chatbot buscarPorId(@PathVariable Long id) {
        return chatbotService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        chatbotService.eliminar(id);
    }
}