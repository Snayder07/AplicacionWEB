package com.example.aplicacionweb.repository;

import com.example.aplicacionweb.model.Inversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InversionRepository extends JpaRepository<Inversion, Long> {
    List<Inversion> findByEstadoInversion(String estadoInversion);
    List<Inversion> findByCliente_NombreDiscordContainingIgnoreCase(String nombreDiscord);

    // Permite inyectar variables de contexto local a la sesión activa de PostgreSQL
    // Cambia esto en tu interfaz de repositorio:
    @Query(value = "SELECT set_config('app.monto_agregado', :monto, true)", nativeQuery = true)
    String setContextoMontoAgregado(@Param("monto") String monto);
}