package com.example.aplicacionweb.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "Compra_robux")
@Data
public class Compra_robux {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_compra_robux")
    private Long idCompraRobux;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Clientes cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_moneda", nullable = false)
    private Moneda moneda;

    @Column(name = "cantidad_robux", nullable = false)
    private Integer cantidadRobux;

    @Column(name = "precio", nullable = false)
    private BigDecimal precio;

    @Column(name = "usuario_roblox", nullable = false, length = 50)
    private String usuarioRoblox;

    @Column(name = "metodo_entrega", nullable = false, length = 20)
    private String metodoEntrega;

    @CreationTimestamp
    @Column(name = "Fecha_compra", nullable = false, updatable = false)
    private LocalDateTime fechaCompra;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estado", nullable = false)
    private Estado estado;

    @Column(name = "Clave", length = 50)
    private String clave;
}
