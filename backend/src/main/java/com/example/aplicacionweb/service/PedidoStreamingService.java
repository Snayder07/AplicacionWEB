package com.negocio.backend.service;

import com.negocio.backend.model.Compra_streaming;
import com.negocio.backend.repository.CompraStreamingRepository;
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