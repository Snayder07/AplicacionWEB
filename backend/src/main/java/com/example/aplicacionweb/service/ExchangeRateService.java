package com.negocio.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Consulta una API pública y gratuita de tasas de cambio (base USD) y las
 * cachea en memoria para poder convertir cualquier moneda a dólares sin
 * golpear la API en cada refresco del Dashboard.
 *
 * Las tasas se refrescan solas cada {@link #REFRESCO_MINUTOS} minutos.
 * Si la consulta falla (sin internet, API caída, etc.) se sigue usando la
 * última tasa conocida para que el Dashboard nunca se rompa por esto.
 */
@Service
public class ExchangeRateService {

    private static final String API_URL = "https://open.er-api.com/v6/latest/USD";
    private static final long REFRESCO_MINUTOS = 30;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(4))
            .build();

    // Cuántas unidades de esa moneda equivalen a 1 USD. Ej: tasas.get("COP") = 4100.5
    private volatile Map<String, BigDecimal> tasasUsdA = new ConcurrentHashMap<>();
    private volatile LocalDateTime ultimaActualizacion;
    private volatile boolean ultimaConsultaFallo = false;

    /**
     * Refresca las tasas solo si ya pasó el intervalo de refresco.
     * Es segura de llamar en cada ciclo del Dashboard: si las tasas siguen
     * frescas, no hace ninguna petición de red.
     */
    public synchronized void actualizarSiEsNecesario() {
        boolean tasasFrescas = ultimaActualizacion != null
                && ultimaActualizacion.plusMinutes(REFRESCO_MINUTOS).isAfter(LocalDateTime.now());
        if (tasasFrescas) {
            return;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .timeout(Duration.ofSeconds(4))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, BigDecimal> nuevasTasas = parsearTasas(response.body());
                if (!nuevasTasas.isEmpty()) {
                    tasasUsdA = nuevasTasas;
                    ultimaActualizacion = LocalDateTime.now();
                    ultimaConsultaFallo = false;
                } else {
                    ultimaConsultaFallo = true;
                }
            } else {
                ultimaConsultaFallo = true;
            }
        } catch (Exception e) {
            ultimaConsultaFallo = true;
            System.err.println("No se pudieron actualizar las tasas de cambio: " + e.getMessage());
        }
    }

    /**
     * Extrae el bloque "rates": { "COP": 4100.5, "EUR": 0.92, ... } del JSON
     * sin necesitar una librería externa.
     */
    private Map<String, BigDecimal> parsearTasas(String json) {
        Map<String, BigDecimal> tasas = new ConcurrentHashMap<>();
        int idx = json.indexOf("\"rates\"");
        if (idx == -1) {
            return tasas;
        }
        String bloqueRates = json.substring(idx);

        Matcher m = Pattern.compile("\"([A-Z]{3})\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)").matcher(bloqueRates);
        while (m.find()) {
            try {
                tasas.put(m.group(1), new BigDecimal(m.group(2)));
            } catch (NumberFormatException ignored) {
                // Si un valor no se puede parsear, simplemente se omite esa moneda.
            }
        }
        return tasas;
    }

    /**
     * Convierte un monto de una moneda dada a dólares (USD).
     *
     * @return el monto convertido, o {@code null} si no se conoce la tasa de
     *         esa moneda (para que quien llame pueda avisar que la conversión
     *         está incompleta en lugar de mostrar un número incorrecto).
     */
    public BigDecimal convertirAUsd(String codigoMoneda, BigDecimal monto) {
        if (monto == null) {
            return BigDecimal.ZERO;
        }
        if (codigoMoneda == null || codigoMoneda.isBlank()) {
            return null;
        }

        String codigo = codigoMoneda.toUpperCase(Locale.ROOT);
        if (codigo.equals("USD")) {
            return monto;
        }

        BigDecimal tasa = tasasUsdA.get(codigo);
        if (tasa == null || tasa.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        return monto.divide(tasa, 4, RoundingMode.HALF_UP);
    }

    public LocalDateTime getUltimaActualizacion() {
        return ultimaActualizacion;
    }

    public boolean isUltimaConsultaFallo() {
        return ultimaConsultaFallo;
    }

    public boolean tieneTasasDisponibles() {
        return !tasasUsdA.isEmpty();
    }
}