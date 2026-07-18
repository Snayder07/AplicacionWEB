package com.example.aplicacionweb.repository;

import com.example.aplicacionweb.model.Compra_streaming;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompraStreamingRepository extends JpaRepository<Compra_streaming, Long> {

    /**
     * Busca el historial de perfiles de streaming comprados por un cliente.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Compra_streaming WHERE id_cliente = ?
     */
    List<Compra_streaming> findByClienteIdCliente(Long idCliente);

    /**
     * Busca todas las suscripciones que vencen en una fecha específica o antes de ella.
     * Ideal para meter una lógica en tu servicio que busque qué cuentas vencen hoy
     * o mañana y mandarles una alerta por Discord.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Compra_streaming WHERE fecha_vencimiento <= ?
     */
    List<Compra_streaming> findByFechaVencimientoLessThanEqual(LocalDate fechaVencimiento);

    /**
     * Busca compras de Streaming cuyo cliente tenga un nombre de Discord que
     * contenga el texto indicado (sin importar mayúsculas/minúsculas).
     * Usado por el buscador/filtro del Dashboard.
     */
    List<Compra_streaming> findByCliente_NombreDiscordContainingIgnoreCase(String nombreDiscord);

    /**
     * Trae TODAS las compras de Streaming con "cliente" y "estado" ya cargados
     * (JOIN FETCH) en la misma consulta, para evitar LazyInitializationException
     * al mostrarlos en pantalla.
     */
    @Query("SELECT s FROM Compra_streaming s JOIN FETCH s.cliente JOIN FETCH s.estado")
    List<Compra_streaming> findAllConDetalles();

    /**
     * Igual que arriba, pero además filtra por nombre de Discord del cliente.
     */
    @Query("SELECT s FROM Compra_streaming s JOIN FETCH s.cliente c JOIN FETCH s.estado " +
            "WHERE LOWER(c.nombreDiscord) LIKE LOWER(CONCAT('%', :nombreDiscord, '%'))")
    List<Compra_streaming> buscarConDetallesPorNombreDiscord(@Param("nombreDiscord") String nombreDiscord);
    List<Compra_streaming> findTop10ByOrderByFechaCompraDesc();
}