package com.negocio.backend.repository;

import com.negocio.backend.model.Moneda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MonedaRepository extends JpaRepository<Moneda, Long> {

    /**
     * Busca una moneda por su código único (ej: "COP", "USD").
     * Esto te permite que, si el frontend envía solo el texto "COP",
     * tu backend pueda buscar y obtener el objeto Moneda completo
     * para vincularlo a la compra en la base de datos.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Moneda WHERE codigo = ?
     */
    Optional<Moneda> findByCodigo(String codigo);
}