package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.model.Moneda;
import com.example.aplicacionweb.repository.MonedaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/monedas")
public class MonedaController {

    @Autowired
    private MonedaRepository monedaRepository;

    @GetMapping
    public List<Moneda> listar() {
        return monedaRepository.findAll();
    }
}
