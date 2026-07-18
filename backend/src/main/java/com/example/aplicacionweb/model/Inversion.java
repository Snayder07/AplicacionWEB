package com.negocio.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inversiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inversion")
    private Long idInversion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Clientes cliente;

    @Column(name = "monto_invertido", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoInvertido;

    @Column(name = "porcentaje_mensual", nullable = false, precision = 8, scale = 2)
    private BigDecimal porcentajeMensual;

    @Column(name = "fecha_inversion_inicial", nullable = false)
    private LocalDate fechaInversionInicial = LocalDate.now();

    @Column(name = "Estado_inversion", nullable = false, length = 20)
    private String estadoInversion;
    // Agrega este campo dentro de tu clase Inversion.java
    //@Column(name = "fecha_ultimo_pago", nullable = false)
   // private LocalDate fechaUltimoPago;

// Asegúrate de que en tu constructor o al crear la inversión,
// la fechaUltimoPago sea igual a la fechaInversionInicial por defecto.
}