package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.EstadoPedidoRequest;
import com.example.aplicacionweb.dto.PedidoStreamingRequest;
import com.example.aplicacionweb.model.*;
import com.example.aplicacionweb.repository.*;
import com.example.aplicacionweb.service.PedidoStreamingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos/streaming")
public class PedidoStreamingController {

    @Autowired
    private PedidoStreamingService pedidoStreamingService;

    @Autowired
    private CompraStreamingRepository repository;

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private CuentasCompradasRepository cuentasRepository;

    @Autowired
    private MonedaRepository monedaRepository;

    @Autowired
    private EstadoRepository estadoRepository;

    @GetMapping
    public List<Compra_streaming> listar() {
        return repository.findAllConDetalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra_streaming> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Compra_streaming crear(@RequestBody PedidoStreamingRequest request) {
        Clientes cliente = clientesRepository.findByNombreDiscord(request.getNombreCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + request.getNombreCliente()));

        Moneda moneda = monedaRepository.findByCodigo(request.getCodigoMoneda() != null ? request.getCodigoMoneda() : "USD")
                .orElseThrow(() -> new RuntimeException("Moneda no encontrada"));

        String codigoBuscado = (request.getCodigoEstado() != null && !request.getCodigoEstado().isBlank())
                ? request.getCodigoEstado()
                : "pend";
        Estado estado = estadoRepository.findByCodigo(codigoBuscado)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado: " + codigoBuscado));

        Cuentas_compradas cuenta = cuentasRepository.findByCorreo(request.getCorreo())
                .orElseGet(() -> {
                    Cuentas_compradas nueva = new Cuentas_compradas();
                    nueva.setPlataforma(request.getPlataforma());
                    nueva.setCorreo(request.getCorreo());
                    nueva.setContrasena(request.getContrasena() != null ? request.getContrasena() : "");
                    nueva.setPrecioCompra(request.getPrecioVenta());
                    nueva.setMoneda(moneda);
                    return cuentasRepository.save(nueva);
                });

        Compra_streaming compra = new Compra_streaming();
        compra.setCliente(cliente);
        compra.setCuentaComprada(cuenta);
        compra.setMoneda(moneda);
        compra.setFechaVencimiento(request.getFechaVencimiento());
        compra.setPrecioVenta(request.getPrecioVenta());
        compra.setEstado(estado);

        return pedidoStreamingService.guardar(compra);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Compra_streaming> actualizarEstado(@PathVariable Long id, @RequestBody EstadoPedidoRequest request) {
        return repository.findById(id)
                .map(pedido -> {
                    Estado estado = estadoRepository.findByCodigo(request.getCodigoEstado())
                            .orElseThrow(() -> new RuntimeException("Estado no encontrado: " + request.getCodigoEstado()));
                    pedido.setEstado(estado);
                    return ResponseEntity.ok(repository.save(pedido));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
