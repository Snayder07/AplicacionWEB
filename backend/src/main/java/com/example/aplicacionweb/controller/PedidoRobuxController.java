package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.PedidoRobuxRequest;
import com.example.aplicacionweb.model.Clientes;
import com.example.aplicacionweb.model.Compra_robux;
import com.example.aplicacionweb.model.Estado;
import com.example.aplicacionweb.model.Moneda;
import com.example.aplicacionweb.repository.ClientesRepository;
import com.example.aplicacionweb.repository.CompraRobuxRepository;
import com.example.aplicacionweb.repository.EstadoRepository;
import com.example.aplicacionweb.repository.MonedaRepository;
import com.example.aplicacionweb.service.PedidoRobuxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos/robux")
public class PedidoRobuxController {

    @Autowired
    private PedidoRobuxService pedidoRobuxService;

    @Autowired
    private CompraRobuxRepository repository;

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private MonedaRepository monedaRepository;

    @Autowired
    private EstadoRepository estadoRepository;

    @GetMapping
    public List<Compra_robux> listar() {
        return repository.findAllConDetalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra_robux> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Compra_robux crear(@RequestBody PedidoRobuxRequest request) {
        Clientes cliente = clientesRepository.findByNombreDiscord(request.getNombreCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + request.getNombreCliente()));

        Moneda moneda = monedaRepository.findByCodigo(request.getCodigoMoneda() != null ? request.getCodigoMoneda() : "USD")
                .orElseThrow(() -> new RuntimeException("Moneda no encontrada"));

        Estado estado = estadoRepository.findByCodigo("pend")
                .orElseThrow(() -> new RuntimeException("Estado 'pend' no encontrado"));

        Compra_robux compra = new Compra_robux();
        compra.setCliente(cliente);
        compra.setMoneda(moneda);
        compra.setCantidadRobux(request.getCantidadRobux());
        compra.setPrecio(request.getPrecio());
        compra.setUsuarioRoblox(request.getUsuarioRoblox());
        compra.setMetodoEntrega(request.getMetodoEntrega());
        compra.setEstado(estado);

        return pedidoRobuxService.guardar(compra);
    }
}
