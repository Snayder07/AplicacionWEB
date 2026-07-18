package com.example.aplicacionweb.repository;

import com.example.aplicacionweb.model.Clientes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientesRepository extends JpaRepository<Clientes, Long> {

    List<Clientes> findByIdDiscordContainingIgnoreCase(String idDiscord);

    // Reutilizamos el mismo molde (DTO)
    public interface ClienteConPedidosDto {
        Long getIdCliente();
        String getNombreDiscord();
        Long getIdDiscord();
        Integer getPedidosTotales();
        String getTieneInversion(); // Aquí caerá 'ACTIVA', 'PAUSADA' o 'NO TIENE'
    }

    @Query(value = "SELECT c.id_cliente AS idCliente, c.nombre_discord AS nombreDiscord, c.id_discord AS idDiscord, " +
            // --- NUEVA LÓGICA BASADA EN EL DIAGRAMA (image_efda42.png) ---
            "COALESCE(" +
            "  (SELECT UPPER(i.Estado_inversion) FROM inversiones i WHERE i.id_cliente = c.id_cliente LIMIT 1), " +
            "  'NO TIENE'" +
            ") AS tieneInversion, " +
            // --- CONTEO DE PEDIDOS TOTALES ---
            "(" +
            "  (SELECT COUNT(*) FROM Compra_robux cr WHERE cr.id_cliente = c.id_cliente) + " +
            "  (SELECT COUNT(*) FROM Compra_streaming cs WHERE cs.id_cliente = c.id_cliente)" +
            ") AS pedidosTotales " +
            "FROM Clientes c",
            nativeQuery = true)
    List<ClienteConPedidosDto> findAllConPedidosCalculados();
}