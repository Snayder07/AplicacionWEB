package com.negocio.backend.service;

import com.negocio.backend.model.Cuentas_compradas;
import com.negocio.backend.repository.CuentasCompradasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CuentasCompradasService {

    @Autowired
    private CuentasCompradasRepository repository;

    public List<Cuentas_compradas> listarTodas() {
        return repository.findAll();
    }

    public Cuentas_compradas guardar(Cuentas_compradas cuenta) {
        return repository.save(cuenta);
    }

    // --- NUEVO MÉTODO: ELIMINAR REGISTRO ---
    public void eliminar(Cuentas_compradas cuenta) {
        repository.delete(cuenta);
    }
}