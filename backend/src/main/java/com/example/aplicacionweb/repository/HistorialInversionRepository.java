package com.example.aplicacionweb.repository;

import com.example.aplicacionweb.model.Historial_inversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialInversionRepository extends JpaRepository<Historial_inversion, Long> {

    /**
     * Busca todo el historial de cambios de una inversión específica,
     * ordenado por la fecha de cumplimiento de forma descendente (el más reciente primero).
     * Ideal para mostrar el estado de cuenta en tu interfaz.
     *
     * Spring Data JPA traduce esto a:
     * SELECT * FROM Historial_inversion WHERE id_inversion = ? ORDER BY Fecha_Cumplida DESC
     */
    List<Historial_inversion> findByInversionIdInversionOrderByFechaCumplidaDesc(Long idInversion);
}