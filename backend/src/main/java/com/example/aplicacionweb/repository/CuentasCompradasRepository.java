package com.negocio.backend.repository;

import com.negocio.backend.model.Cuentas_compradas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CuentasCompradasRepository extends JpaRepository<Cuentas_compradas, Long> {

    /**
     * Busca todas las cuentas que pertenecen a una plataforma en específico.
     * Ideal para filtrar tu inventario (ej: ver solo las cuentas de 'Netflix').
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Cuentas_compradas WHERE plataforma = ?
     */
    List<Cuentas_compradas> findByPlataforma(String plataforma);

    /**
     * Busca una cuenta específica por su correo electrónico.
     * Útil si un proveedor te cambia una clave y necesitas actualizarla en el sistema.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Cuentas_compradas WHERE correo = ?
     */
    Optional<Cuentas_compradas> findByCorreo(String correo);
}