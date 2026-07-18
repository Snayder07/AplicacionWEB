package com.example.aplicacionweb.service;

import com.example.aplicacionweb.model.Historial_inversion;
import com.example.aplicacionweb.model.Inversion;
import com.example.aplicacionweb.repository.HistorialInversionRepository;
import com.example.aplicacionweb.repository.InversionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class InversionService {

    @Autowired
    private InversionRepository inversionRepository;

    @Autowired
    private HistorialInversionRepository historialRepository;

    /**
     * [NUEVO] Obtiene todas las inversiones registradas en el sistema.
     */
    public List<Inversion> obtenerTodasLasInversiones() {
        return inversionRepository.findAll();
    }

    /**
     * [NUEVO] Busca inversiones filtrando por el nombre de Discord del cliente.
     */
    public List<Inversion> buscarInversionesPorCliente(String filtro) {
        if (filtro == null || filtro.trim().isEmpty()) {
            return obtenerTodasLasInversiones();
        }
        return inversionRepository.findByCliente_NombreDiscordContainingIgnoreCase(filtro.trim());
    }

    /**
     * [NUEVO] Permite agregar o inyectar capital manualmente a una inversión existente
     * desde el menú contextual (clic derecho) de la tabla.
     */
    @Transactional
    public void agregarCapitalAInversion(Long idInversion, BigDecimal montoAAgregar) {
        Inversion inv = inversionRepository.findById(idInversion)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la inversión con ID: " + idInversion));

        BigDecimal montoAnterior = inv.getMontoInvertido();
        BigDecimal nuevoMonto = montoAnterior.add(montoAAgregar);

        // 1. Guardar el movimiento en la tabla Historial_inversion
        Historial_inversion historial = new Historial_inversion();
        historial.setInversion(inv);
        historial.setMontoAnterior(montoAnterior);
        historial.setMontoGenerado(BigDecimal.ZERO); // No es rendimiento del mes
        historial.setMontoActual(nuevoMonto);
        historial.setAgregado("S"); // 'S' de Sí fue una inyección manual de capital

        // Seteamos el valor en tu columna específica de inyección si la tienes mapeada:
        historial.setMontoAgregado(montoAAgregar);

        historialRepository.save(historial);

        // 2. Modificar el capital principal de la inversión
        inv.setMontoInvertido(nuevoMonto);
        inversionRepository.save(inv);
    }

    /**
     * Verifica e inyecta de forma retroactiva los rendimientos mensuales
     * que se hayan acumulado si la aplicación estuvo cerrada o apagada.
     */
    @Transactional
    public void verificarYProcesarRendimientosPendientes() {
        List<Inversion> activas = inversionRepository.findByEstadoInversion("activa");
        LocalDate hoy = LocalDate.now();

        for (Inversion inv : activas) {
            LocalDate fechaControl = inv.getFechaInversionInicial();
            long mesesPendientes = ChronoUnit.MONTHS.between(fechaControl, hoy);

            if (mesesPendientes > 0) {
                BigDecimal montoActual = inv.getMontoInvertido();
                BigDecimal porcentaje = inv.getPorcentajeMensual().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);

                for (int i = 0; i < mesesPendientes; i++) {
                    BigDecimal rendimientoGenerado = montoActual.multiply(porcentaje).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal nuevoMonto = montoActual.add(rendimientoGenerado).setScale(2, RoundingMode.HALF_UP);

                    Historial_inversion historial = new Historial_inversion();
                    historial.setInversion(inv);
                    historial.setMontoAnterior(montoActual);
                    historial.setMontoGenerado(rendimientoGenerado);
                    historial.setMontoActual(nuevoMonto);
                    historial.setAgregado("N"); // 'N' automático

                    // =======================================================
                    // ¡SOLUCIÓN AQUÍ! Evita el error pasándole Cero en vez de null
                    // =======================================================
                    historial.setMontoAgregado(BigDecimal.ZERO);

                    historialRepository.save(historial);

                    montoActual = nuevoMonto;
                }

                inv.setMontoInvertido(montoActual);
                inv.setFechaInversionInicial(fechaControl.plusMonths(mesesPendientes));
                inversionRepository.save(inv);
            }
        }
    }
}