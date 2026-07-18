package com.negocio.backend.service;

import com.negocio.backend.model.Clientes;
import com.negocio.backend.repository.ClientesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientesService {

    @Autowired
    private ClientesRepository clienteRepository;

    public List<Clientes> listarTodos() {
        return clienteRepository.findAll();
    }

    public Clientes guardarCliente(Clientes cliente) {
        return clienteRepository.save(cliente);
    }

    // Asegúrate de que apunte al nuevo método del repositorio
    public List<Clientes> buscarPorDiscordId(String idDiscord) {
        return clienteRepository.findByIdDiscordContainingIgnoreCase(idDiscord);
    }
    // En ClientesService.java:
    public List<ClientesRepository.ClienteConPedidosDto> listarClientesConPedidos() {
        return clienteRepository.findAllConPedidosCalculados();
    }
}