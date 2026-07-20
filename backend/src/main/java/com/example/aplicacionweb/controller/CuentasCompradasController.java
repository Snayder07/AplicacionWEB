package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.CuentaStreamingRequest;
import com.example.aplicacionweb.model.Cuentas_compradas;
import com.example.aplicacionweb.model.Moneda;
import com.example.aplicacionweb.repository.CuentasCompradasRepository;
import com.example.aplicacionweb.repository.MonedaRepository;
import com.example.aplicacionweb.service.CuentasCompradasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas-streaming")
public class CuentasCompradasController {

    @Autowired
    private CuentasCompradasService service;

    @Autowired
    private CuentasCompradasRepository repository;

    @Autowired
    private MonedaRepository monedaRepository;

    @GetMapping
    public List<Cuentas_compradas> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuentas_compradas> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cuentas_compradas crear(@RequestBody CuentaStreamingRequest request) {
        Moneda moneda = monedaRepository.findByCodigo(request.getCodigoMoneda() != null ? request.getCodigoMoneda() : "USD")
                .orElseThrow(() -> new RuntimeException("Moneda no encontrada"));

        Cuentas_compradas cuenta = new Cuentas_compradas();
        cuenta.setPlataforma(request.getPlataforma());
        cuenta.setCorreo(request.getCorreo());
        cuenta.setContrasena(request.getContrasena());
        cuenta.setPrecioCompra(request.getPrecioCompra());
        cuenta.setMoneda(moneda);

        return service.guardar(cuenta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return repository.findById(id)
                .map(cuenta -> {
                    service.eliminar(cuenta);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
