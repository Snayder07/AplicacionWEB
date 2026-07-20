package com.example.aplicacionweb.dto;

import java.math.BigDecimal;

public class CuentaStreamingRequest {
    private String plataforma;
    private String correo;
    private String contrasena;
    private BigDecimal precioCompra;
    private String codigoMoneda;

    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public BigDecimal getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(BigDecimal precioCompra) { this.precioCompra = precioCompra; }
    public String getCodigoMoneda() { return codigoMoneda; }
    public void setCodigoMoneda(String codigoMoneda) { this.codigoMoneda = codigoMoneda; }
}
