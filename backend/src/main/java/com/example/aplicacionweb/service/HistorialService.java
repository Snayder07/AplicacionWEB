package com.example.aplicacionweb.service;

import com.example.aplicacionweb.repository.CompraRobuxRepository;
import com.example.aplicacionweb.repository.CompraStreamingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HistorialService {

    @Autowired
    private CompraRobuxRepository compraRobuxRepository;

    @Autowired
    private CompraStreamingRepository compraStreamingRepository;

    public static final String TIPO_GENERAL = "General";
    public static final String TIPO_ROBUX = "Robux";
    public static final String TIPO_STREAMING = "Streaming";

    /**
     * Trae los pedidos filtrados por tipo para la tabla del Historial.
     */
    public List<Object> obtenerPedidosPorTipo(String tipo) {
        List<Object> resultado = new ArrayList<>();
        if (tipo == null) {
            return resultado;
        }

        switch (tipo) {
            case TIPO_GENERAL -> {
                resultado.addAll(compraRobuxRepository.findAllConDetalles());
                resultado.addAll(compraStreamingRepository.findAllConDetalles());
            }
            case TIPO_ROBUX -> resultado.addAll(compraRobuxRepository.findAllConDetalles());
            case TIPO_STREAMING -> resultado.addAll(compraStreamingRepository.findAllConDetalles());
        }

        return resultado;
    }
}