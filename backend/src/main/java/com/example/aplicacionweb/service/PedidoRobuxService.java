package com.example.aplicacionweb.service;

import com.example.aplicacionweb.model.Compra_robux;
import com.example.aplicacionweb.repository.CompraRobuxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoRobuxService {

    @Autowired
    private CompraRobuxRepository repository;

    public Compra_robux guardar(Compra_robux robux) {
        return repository.save(robux);
    }
}