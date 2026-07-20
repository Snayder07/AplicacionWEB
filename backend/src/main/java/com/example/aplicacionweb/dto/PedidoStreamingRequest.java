package com.example.aplicacionweb.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PedidoStreamingRequest {
    private String nombreCliente;
    private String plataforma;
    private String correo;
    private String contrasena;
    private LocalDate fechaVencimiento;
    private BigDecimal precioVenta;
    private String codigoMoneda;

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    public BigDecimal getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(BigDecimal precioVenta) { this.precioVenta = precioVenta; }
    public String getCodigoMoneda() { return codigoMoneda; }
    public void setCodigoMoneda(String codigoMoneda) { this.codigoMoneda = codigoMoneda; }
}
