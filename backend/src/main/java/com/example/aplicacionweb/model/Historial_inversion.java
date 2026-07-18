package com.negocio.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Historial_inversion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Historial_inversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_inv")
    private Long idHistorialInv;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_inversion", nullable = false)
    private Inversion inversion;

    @Column(name = "Monto_anterior", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoAnterior;

    @Column(name = "Monto_actual", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoActual;

    @Column(name = "Monto_generado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoGenerado;

    @CreationTimestamp
    @Column(name = "Fecha_Cumplida", nullable = false, updatable = false)
    private LocalDateTime fechaCumplida;

    @Column(name = "agregado", nullable = false, length = 1)
    private String agregado;

    @Column(name = "monto_agregado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoAgregado;
}