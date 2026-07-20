package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.CapitalRequest;
import com.example.aplicacionweb.dto.InversionRequest;
import com.example.aplicacionweb.model.Clientes;
import com.example.aplicacionweb.model.Inversion;
import com.example.aplicacionweb.repository.ClientesRepository;
import com.example.aplicacionweb.repository.InversionRepository;
import com.example.aplicacionweb.service.InversionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inversiones")
public class InversionController {

    @Autowired
    private InversionService inversionService;

    @Autowired
    private InversionRepository inversionRepository;

    @Autowired
    private ClientesRepository clientesRepository;

    @GetMapping
    public List<Inversion> listar() {
        return inversionService.obtenerTodasLasInversiones();
    }

    @GetMapping("/buscar")
    public List<Inversion> buscar(@RequestParam(required = false) String cliente) {
        return inversionService.buscarInversionesPorCliente(cliente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inversion> obtener(@PathVariable Long id) {
        return inversionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inversion crear(@RequestBody InversionRequest request) {
        Clientes cliente = clientesRepository.findByNombreDiscord(request.getNombreCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + request.getNombreCliente()));

        Inversion inversion = new Inversion();
        inversion.setCliente(cliente);
        inversion.setMontoInvertido(request.getMontoInvertido());
        inversion.setPorcentajeMensual(request.getPorcentajeMensual());
        inversion.setFechaInversionInicial(request.getFechaInversionInicial());
        inversion.setEstadoInversion("activa");

        return inversionRepository.save(inversion);
    }

    @PostMapping("/{id}/capital")
    public ResponseEntity<Void> agregarCapital(@PathVariable Long id, @RequestBody CapitalRequest request) {
        inversionService.agregarCapitalAInversion(id, request.getMonto());
        return ResponseEntity.ok().build();
    }
}
