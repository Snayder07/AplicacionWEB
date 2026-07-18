package com.example.aplicacionweb.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Moneda")
public class Moneda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_moneda")
    private Long idMoneda;

    @Column(name = "nombre_moneda", nullable = false, unique = true, length = 20)
    private String nombreMoneda;

    @Column(name = "codigo", nullable = false, unique = true, length = 5)
    private String codigo;
}
