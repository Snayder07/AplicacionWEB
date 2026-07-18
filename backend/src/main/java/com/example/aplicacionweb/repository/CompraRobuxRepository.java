package com.example.aplicacionweb.repository;

import com.example.aplicacionweb.model.Compra_robux;
import com.example.aplicacionweb.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompraRobuxRepository extends JpaRepository<Compra_robux, Long> {

    /**
     * Busca todas las compras de Robux asociadas a un cliente específico.
     * Útil para ver cuántas veces te ha comprado un usuario.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Compra_robux WHERE id_cliente = ?
     */
    List<Compra_robux> findByClienteIdCliente(Long idCliente);

    /**
     * Busca todas las compras de Robux según su estado actual (ej: "pendiente").
     * Ideal para tu panel de administración, mostrando solo los pedidos
     * que tienes pendientes por transferir en Roblox.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Compra_robux WHERE Estado_compra = ?
     */
    List<Compra_robux> findByEstado(Estado estado);

    /**
     * Busca compras de Robux cuyo cliente tenga un nombre de Discord que
     * contenga el texto indicado (sin importar mayúsculas/minúsculas).
     * Usado por el buscador/filtro del Dashboard.
     *
     * Spring Data JPA traduce esto a:
     * SELECT cr.* FROM Compra_robux cr JOIN Clientes c ON cr.id_cliente = c.id_cliente
     * WHERE c.Nombre_discord ILIKE %texto%
     */
    List<Compra_robux> findByCliente_NombreDiscordContainingIgnoreCase(String nombreDiscord);

    /**
     * Trae TODAS las compras de Robux con "cliente" y "estado" ya cargados
     * (JOIN FETCH) en la misma consulta. Esto evita el error
     * "LazyInitializationException - no session" que ocurre si se intenta
     * leer cliente/estado después de que la consulta ya terminó.
     * Usar este método siempre que se necesite mostrar cliente o estado en pantalla.
     */
    @Query("SELECT r FROM Compra_robux r JOIN FETCH r.cliente JOIN FETCH r.estado")
    List<Compra_robux> findAllConDetalles();

    /**
     * Igual que arriba, pero además filtra por nombre de Discord del cliente.
     */
    @Query("SELECT r FROM Compra_robux r JOIN FETCH r.cliente c JOIN FETCH r.estado " +
            "WHERE LOWER(c.nombreDiscord) LIKE LOWER(CONCAT('%', :nombreDiscord, '%'))")
    List<Compra_robux> buscarConDetallesPorNombreDiscord(@Param("nombreDiscord") String nombreDiscord);

    List<Compra_robux> findTop10ByOrderByFechaCompraDesc();

}
