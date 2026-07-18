package com.example.aplicacionweb.service;

import com.example.aplicacionweb.model.Compra_streaming;
import com.example.aplicacionweb.repository.CompraStreamingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoStreamingService {

    @Autowired
    private CompraStreamingRepository repository;

    public Compra_streaming guardar(Compra_streaming streaming) {
        return repository.save(streaming);
    }
}