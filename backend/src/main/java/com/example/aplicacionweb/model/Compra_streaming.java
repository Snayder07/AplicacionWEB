package com.example.aplicacionweb.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Compra_streaming")
@Data
public class Compra_streaming {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_compra_Streaming")
    private Long idCompraStreaming;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Clientes cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_Cuentas_compradas", nullable = false)
    private Cuentas_compradas cuentaComprada;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_moneda", nullable = false)
    private Moneda moneda;

    @CreationTimestamp
    @Column(name = "fecha_compra", nullable = false, updatable = false)
    private LocalDateTime fechaCompra;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Column(name = "precio_venta", nullable = false)
    private BigDecimal precioVenta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estado", nullable = false)
    private Estado estado;
}

