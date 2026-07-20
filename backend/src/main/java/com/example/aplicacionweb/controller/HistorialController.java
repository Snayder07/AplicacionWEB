package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.model.Historial_inversion;
import com.example.aplicacionweb.repository.HistorialInversionRepository;
import com.example.aplicacionweb.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
public class HistorialController {

    @Autowired
    private HistorialService historialService;

    @Autowired
    private HistorialInversionRepository historialRepository;

    @GetMapping("/pedidos")
    public List<Object> listarPedidos(@RequestParam(defaultValue = "General") String tipo) {
        return historialService.obtenerPedidosPorTipo(tipo);
    }

    @GetMapping("/inversiones/{idInversion}")
    public List<Historial_inversion> historialInversion(@PathVariable Long idInversion) {
        return historialRepository.findByInversionIdInversionOrderByFechaCumplidaDesc(idInversion);
    }
}
