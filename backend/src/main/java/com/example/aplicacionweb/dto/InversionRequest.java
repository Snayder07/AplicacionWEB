package com.example.aplicacionweb.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InversionRequest {
    private String nombreCliente;
    private BigDecimal montoInvertido;
    private BigDecimal porcentajeMensual;
    private LocalDate fechaInversionInicial;
    private String estadoInversion;

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public BigDecimal getMontoInvertido() { return montoInvertido; }
    public void setMontoInvertido(BigDecimal montoInvertido) { this.montoInvertido = montoInvertido; }
    public BigDecimal getPorcentajeMensual() { return porcentajeMensual; }
    public void setPorcentajeMensual(BigDecimal porcentajeMensual) { this.porcentajeMensual = porcentajeMensual; }
    public LocalDate getFechaInversionInicial() { return fechaInversionInicial; }
    public void setFechaInversionInicial(LocalDate fechaInversionInicial) { this.fechaInversionInicial = fechaInversionInicial; }
    public String getEstadoInversion() { return estadoInversion; }
    public void setEstadoInversion(String estadoInversion) { this.estadoInversion = estadoInversion; }
}
