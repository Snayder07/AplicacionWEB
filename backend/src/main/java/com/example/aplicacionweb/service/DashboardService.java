package com.example.aplicacionweb.service;

import com.example.aplicacionweb.model.Compra_robux;
import com.example.aplicacionweb.model.Compra_streaming;
import com.example.aplicacionweb.repository.ClientesRepository;
import com.example.aplicacionweb.repository.CompraRobuxRepository;
import com.example.aplicacionweb.repository.CompraStreamingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Centraliza todos los cálculos que necesita el Dashboard:
 * totales generales, ventas por día, distribución de pedidos y estados,
 * y el listado de pedidos más recientes.
 *
 * Se apoya en los repositorios ya existentes (findAllConDetalles) para no
 * duplicar consultas SQL y evitar problemas de LazyInitializationException.
 */
@Service
public class DashboardService {

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private CompraRobuxRepository compraRobuxRepository;

    @Autowired
    private CompraStreamingRepository compraStreamingRepository;

    @Autowired
    private ExchangeRateService exchangeRateService;

    public DashboardStats obtenerEstadisticas() {
        // Antes, estas 4 consultas se hacían una tras otra (en fila). Ahora se
        // disparan todas al mismo tiempo y solo se espera lo que tarde la más
        // lenta de todas, en vez de sumar el tiempo de las 4. Esto hace que el
        // Dashboard cargue más rápido, sobre todo cuando toca refrescar la
        // tasa de cambio por internet.
        CompletableFuture<Void> futuroTasas = CompletableFuture.runAsync(exchangeRateService::actualizarSiEsNecesario);
        CompletableFuture<List<Compra_robux>> futuroRobux =
                CompletableFuture.supplyAsync(() -> safe(compraRobuxRepository::findAllConDetalles));
        CompletableFuture<List<Compra_streaming>> futuroStreaming =
                CompletableFuture.supplyAsync(() -> safe(compraStreamingRepository::findAllConDetalles));
        CompletableFuture<Long> futuroTotalClientes =
                CompletableFuture.supplyAsync(clientesRepository::count);

        CompletableFuture.allOf(futuroTasas, futuroRobux, futuroStreaming, futuroTotalClientes).join();

        List<Compra_robux> robux = futuroRobux.join();
        List<Compra_streaming> streaming = futuroStreaming.join();

        DashboardStats stats = new DashboardStats();

        // ===== TOTALES GENERALES =====
        stats.totalClientes = futuroTotalClientes.join();
        stats.totalPedidos = robux.size() + streaming.size();

        LocalDate hoy = LocalDate.now();
        stats.pedidosHoy = (int) (robux.stream().filter(r -> mismaFecha(r.getFechaCompra(), hoy)).count()
                + streaming.stream().filter(s -> mismaFecha(s.getFechaCompra(), hoy)).count());

        // ===== ESTADOS =====
        // "Pendientes" agrupa: Pendiente, En tratamiento y Anotados
        // (son estados intermedios: el pedido todavía no está terminado).
        stats.pedidosPendientes = contarPorEstado(robux, streaming, "pend", "tratamiento", "anotad");
        stats.pedidosCompletados = contarPorEstado(robux, streaming, "complet");

        // ===== CUENTAS POR VENCER (próximos 3 días) =====
        LocalDate limite = hoy.plusDays(3);
        stats.cuentasPorVencer = streaming.stream()
                .filter(s -> s.getFechaVencimiento() != null
                        && !s.getFechaVencimiento().isBefore(hoy)
                        && !s.getFechaVencimiento().isAfter(limite))
                .count();

        // ===== VENTAS ÚLTIMOS 7 DÍAS (para la gráfica de línea) =====
        stats.ventasUltimos7Dias = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate dia = hoy.minusDays(i);
            BigDecimal totalDia = robux.stream()
                    .filter(r -> mismaFecha(r.getFechaCompra(), dia))
                    .map(Compra_robux::getPrecio)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .add(streaming.stream()
                            .filter(s -> mismaFecha(s.getFechaCompra(), dia))
                            .map(Compra_streaming::getPrecioVenta)
                            .filter(java.util.Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add));

            String etiqueta = capitalizar(dia.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("es", "ES")));
            stats.ventasUltimos7Dias.put(etiqueta, totalDia);
        }

        // ===== PEDIDOS POR ESTADO (para la gráfica de barras) =====
        Map<String, Integer> porEstado = new LinkedHashMap<>();
        robux.forEach(r -> acumularEstado(porEstado, r.getEstado() != null ? r.getEstado().getNombreEstado() : null));
        streaming.forEach(s -> acumularEstado(porEstado, s.getEstado() != null ? s.getEstado().getNombreEstado() : null));
        stats.pedidosPorEstado = porEstado;

        // ===== ÚLTIMOS PEDIDOS (para la tabla) =====
        List<DashboardStats.PedidoReciente> recientes = new ArrayList<>();
        robux.forEach(r -> recientes.add(new DashboardStats.PedidoReciente(
                r.getCliente() != null ? r.getCliente().getNombreDiscord() : "N/D",
                "Robux",
                r.getPrecio(),
                r.getEstado() != null ? r.getEstado().getNombreEstado() : "N/D",
                r.getFechaCompra()
        )));
        streaming.forEach(s -> recientes.add(new DashboardStats.PedidoReciente(
                s.getCliente() != null ? s.getCliente().getNombreDiscord() : "N/D",
                "Streaming",
                s.getPrecioVenta(),
                s.getEstado() != null ? s.getEstado().getNombreEstado() : "N/D",
                s.getFechaCompra()
        )));

        stats.pedidosRecientes = recientes.stream()
                .filter(p -> p.getFecha() != null)
                .sorted((a, b) -> b.getFecha().compareTo(a.getFecha()))
                .limit(8)
                .collect(Collectors.toList());

        // ===== TOTAL POR TIPO DE MONEDA (mini cuadros) =====
        Map<String, DashboardStats.MonedaResumen> resumenPorMoneda = new java.util.TreeMap<>();

        robux.forEach(r -> acumularMoneda(resumenPorMoneda, r.getMoneda(), r.getPrecio()));
        streaming.forEach(s -> acumularMoneda(resumenPorMoneda, s.getMoneda(), s.getPrecioVenta()));

        stats.resumenPorMoneda = new ArrayList<>(resumenPorMoneda.values());

        // ===== VENTAS TOTALES Y DE HOY, CONVERTIDAS A USD =====
        // No tiene sentido sumar pesos + dólares + euros directamente, así que
        // cada moneda se convierte primero a USD usando la tasa de cambio real.
        Map<String, BigDecimal> totalHoyPorMoneda = new LinkedHashMap<>();
        robux.stream().filter(r -> mismaFecha(r.getFechaCompra(), hoy))
                .forEach(r -> sumarEnMapa(totalHoyPorMoneda, r.getMoneda(), r.getPrecio()));
        streaming.stream().filter(s -> mismaFecha(s.getFechaCompra(), hoy))
                .forEach(s -> sumarEnMapa(totalHoyPorMoneda, s.getMoneda(), s.getPrecioVenta()));

        Map<String, BigDecimal> totalGeneralPorMoneda = new LinkedHashMap<>();
        resumenPorMoneda.forEach((codigo, resumen) -> totalGeneralPorMoneda.put(codigo, resumen.getTotal()));

        ConversionUsd conversionTotal = convertirTotalAUsd(totalGeneralPorMoneda);
        stats.ventasTotalesUsd = conversionTotal.total;
        stats.conversionIncompleta = conversionTotal.incompleta;

        ConversionUsd conversionHoy = convertirTotalAUsd(totalHoyPorMoneda);
        stats.ventasHoyUsd = conversionHoy.total;
        stats.conversionIncompleta = stats.conversionIncompleta || conversionHoy.incompleta;

        stats.tasasActualizadasEn = exchangeRateService.getUltimaActualizacion();
        stats.tasasDisponibles = exchangeRateService.tieneTasasDisponibles();

        return stats;
    }

    /**
     * Suma en USD todos los montos que están agrupados por código de moneda.
     * Si alguna moneda no tiene tasa conocida, se marca como conversión
     * incompleta para poder avisarle al admin en pantalla.
     */
    private ConversionUsd convertirTotalAUsd(Map<String, BigDecimal> totalesPorMoneda) {
        BigDecimal total = BigDecimal.ZERO;
        boolean incompleta = false;
        for (Map.Entry<String, BigDecimal> entry : totalesPorMoneda.entrySet()) {
            BigDecimal convertido = exchangeRateService.convertirAUsd(entry.getKey(), entry.getValue());
            if (convertido == null) {
                incompleta = true;
            } else {
                total = total.add(convertido);
            }
        }
        return new ConversionUsd(total, incompleta);
    }

    private void sumarEnMapa(Map<String, BigDecimal> mapa, com.example.aplicacionweb.model.Moneda moneda, BigDecimal monto) {
        if (moneda == null || moneda.getCodigo() == null || monto == null) {
            return;
        }
        mapa.merge(moneda.getCodigo().toUpperCase(Locale.ROOT), monto, BigDecimal::add);
    }

    private record ConversionUsd(BigDecimal total, boolean incompleta) {
    }

    private void acumularMoneda(Map<String, DashboardStats.MonedaResumen> mapa,
                                com.example.aplicacionweb.model.Moneda moneda,
                                BigDecimal monto) {
        if (moneda == null || moneda.getCodigo() == null || monto == null) {
            return;
        }
        String codigo = moneda.getCodigo().toUpperCase(Locale.ROOT);
        DashboardStats.MonedaResumen resumen = mapa.computeIfAbsent(codigo,
                c -> new DashboardStats.MonedaResumen(c, moneda.getNombreMoneda()));
        resumen.sumar(monto);
    }

    // ================= HELPERS =================

    private boolean mismaFecha(LocalDateTime fecha, LocalDate dia) {
        return fecha != null && fecha.toLocalDate().isEqual(dia);
    }

    /**
     * Cuenta cuántos pedidos (robux + streaming) tienen un estado que
     * contiene AL MENOS UNA de las palabras clave dadas.
     * Ej: contarPorEstado(robux, streaming, "pend", "tratamiento", "anotad")
     * cuenta como "pendientes" tanto los que dicen "Pendiente" como los que
     * están "En tratamiento" o "Anotados".
     */
    private long contarPorEstado(List<Compra_robux> robux, List<Compra_streaming> streaming, String... palabrasClave) {
        long enRobux = robux.stream()
                .filter(r -> estadoContieneAlguna(r.getEstado() != null ? r.getEstado().getNombreEstado() : null, palabrasClave))
                .count();
        long enStreaming = streaming.stream()
                .filter(s -> estadoContieneAlguna(s.getEstado() != null ? s.getEstado().getNombreEstado() : null, palabrasClave))
                .count();
        return enRobux + enStreaming;
    }

    private boolean estadoContieneAlguna(String nombreEstado, String... palabrasClave) {
        if (nombreEstado == null) {
            return false;
        }
        String estadoMinusculas = nombreEstado.toLowerCase(Locale.ROOT);
        for (String palabra : palabrasClave) {
            if (estadoMinusculas.contains(palabra)) {
                return true;
            }
        }
        return false;
    }

    private void acumularEstado(Map<String, Integer> mapa, String nombreEstado) {
        String clave = (nombreEstado == null || nombreEstado.isBlank()) ? "Sin estado" : nombreEstado;
        mapa.merge(clave, 1, Integer::sum);
    }

    private String capitalizar(String texto) {
        if (texto == null || texto.isEmpty()) return texto;
        return texto.substring(0, 1).toUpperCase(Locale.ROOT) + texto.substring(1);
    }

    @FunctionalInterface
    private interface Fetcher<T> {
        List<T> get();
    }

    private <T> List<T> safe(Fetcher<T> fetcher) {
        try {
            List<T> lista = fetcher.get();
            return lista != null ? lista : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error cargando datos del dashboard: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * DTO simple con todo lo que necesita pintar el Dashboard.
     */
    public static class DashboardStats {
        public long totalClientes;
        public long totalPedidos;
        public int pedidosHoy;
        public BigDecimal ventasTotalesUsd = BigDecimal.ZERO;
        public BigDecimal ventasHoyUsd = BigDecimal.ZERO;
        public boolean conversionIncompleta = false;
        public boolean tasasDisponibles = false;
        public LocalDateTime tasasActualizadasEn;
        public long pedidosPendientes;
        public long pedidosCompletados;
        public long cuentasPorVencer;
        public Map<String, BigDecimal> ventasUltimos7Dias = new LinkedHashMap<>();
        public Map<String, Integer> pedidosPorEstado = new LinkedHashMap<>();
        public List<PedidoReciente> pedidosRecientes = new ArrayList<>();
        public List<MonedaResumen> resumenPorMoneda = new ArrayList<>();

        /**
         * Total acumulado de dinero recibido en un tipo de moneda específico
         * (ej: COP, USD, EUR...), para pintar un mini cuadro por cada una.
         */
        public static class MonedaResumen {
            private final String codigo;
            private final String nombre;
            private BigDecimal total = BigDecimal.ZERO;
            private long cantidadPedidos = 0;

            public MonedaResumen(String codigo, String nombre) {
                this.codigo = codigo;
                this.nombre = nombre;
            }

            public void sumar(BigDecimal monto) {
                this.total = this.total.add(monto);
                this.cantidadPedidos++;
            }

            public String getCodigo() { return codigo; }
            public String getNombre() { return nombre; }
            public BigDecimal getTotal() { return total; }
            public long getCantidadPedidos() { return cantidadPedidos; }
        }

        public static class PedidoReciente {
            private final String cliente;
            private final String tipo;
            private final BigDecimal monto;
            private final String estado;
            private final LocalDateTime fecha;

            public PedidoReciente(String cliente, String tipo, BigDecimal monto, String estado, LocalDateTime fecha) {
                this.cliente = cliente;
                this.tipo = tipo;
                this.monto = monto != null ? monto : BigDecimal.ZERO;
                this.estado = estado;
                this.fecha = fecha;
            }

            public String getCliente() { return cliente; }
            public String getTipo() { return tipo; }
            public BigDecimal getMonto() { return monto; }
            public String getEstado() { return estado; }
            public LocalDateTime getFecha() { return fecha; }
        }
    }
}
