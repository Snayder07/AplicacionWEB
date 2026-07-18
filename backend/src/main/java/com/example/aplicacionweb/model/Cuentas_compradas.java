package com.example.aplicacionweb.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cuentas_compradas", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"correo", "plataforma"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Cuentas_compradas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuentas")
    private Long idCuentas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_moneda", nullable = false)
    private Moneda moneda;

    @Column(name = "plataforma", nullable = false, length = 30)
    private String plataforma;

    @Column(name = "correo", nullable = false, length = 50)
    private String correo;

    @Column(name = "contrasena", nullable = false, length = 30)
    private String contrasena;

    @Column(name = "precio_compra", nullable = false)
    private BigDecimal precioCompra;

    @CreationTimestamp
    @Column(name = "fecha_compra_cuenta", nullable = false, updatable = false)
    private LocalDateTime fechaCompraCuenta;

}