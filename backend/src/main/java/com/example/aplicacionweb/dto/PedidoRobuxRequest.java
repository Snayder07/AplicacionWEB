package com.example.aplicacionweb.dto;

import java.math.BigDecimal;

public class PedidoRobuxRequest {
    private String nombreCliente;
    private String usuarioRoblox;
    private Integer cantidadRobux;
    private BigDecimal precio;
    private String metodoEntrega;
    private String codigoMoneda;

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public String getUsuarioRoblox() { return usuarioRoblox; }
    public void setUsuarioRoblox(String usuarioRoblox) { this.usuarioRoblox = usuarioRoblox; }
    public Integer getCantidadRobux() { return cantidadRobux; }
    public void setCantidadRobux(Integer cantidadRobux) { this.cantidadRobux = cantidadRobux; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public String getMetodoEntrega() { return metodoEntrega; }
    public void setMetodoEntrega(String metodoEntrega) { this.metodoEntrega = metodoEntrega; }
    public String getCodigoMoneda() { return codigoMoneda; }
    public void setCodigoMoneda(String codigoMoneda) { this.codigoMoneda = codigoMoneda; }
}
