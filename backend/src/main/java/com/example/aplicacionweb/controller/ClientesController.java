package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.ClienteRequest;
import com.example.aplicacionweb.model.Clientes;
import com.example.aplicacionweb.repository.ClientesRepository;
import com.example.aplicacionweb.service.ClientesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClientesController {

    @Autowired
    private ClientesService clientesService;

    @Autowired
    private ClientesRepository clientesRepository;

    @GetMapping
    public List<Clientes> listar() {
        return clientesService.listarTodos();
    }

    @GetMapping("/con-pedidos")
    public List<ClientesRepository.ClienteConPedidosDto> listarConPedidos() {
        return clientesService.listarClientesConPedidos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clientes> obtener(@PathVariable Long id) {
        return clientesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Clientes crear(@RequestBody ClienteRequest request) {
        Clientes cliente = new Clientes();
        cliente.setNombreDiscord(request.getNombreDiscord());
        cliente.setIdDiscord(request.getIdDiscord());
        return clientesService.guardarCliente(cliente);
    }

    @GetMapping("/buscar")
    public List<Clientes> buscarPorDiscord(@RequestParam(required = false) String idDiscord) {
        if (idDiscord != null && !idDiscord.isBlank()) {
            return clientesService.buscarPorDiscordId(idDiscord);
        }
        return clientesService.listarTodos();
    }
}
