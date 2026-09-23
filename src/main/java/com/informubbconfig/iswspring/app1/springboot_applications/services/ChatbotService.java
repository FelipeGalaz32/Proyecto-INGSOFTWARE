package com.informubbconfig.iswspring.app1.springboot_applications.services;

import com.informubbconfig.iswspring.app1.springboot_applications.models.Chatbot;
import com.informubbconfig.iswspring.app1.springboot_applications.repositories.ChatbotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatbotService {

    @Autowired
    private ChatbotRepository chatbotRepository;

    @Transactional(readOnly = true)
    public List<Chatbot> listarTodos() {
        return chatbotRepository.findAll();
    }

    @Transactional
    public Chatbot guardar(Chatbot chatbot) {
        return chatbotRepository.save(chatbot);
    }

    @Transactional(readOnly = true)
    public Chatbot buscarPorId(Long id) {
        return chatbotRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        chatbotRepository.deleteById(id);
    }
}