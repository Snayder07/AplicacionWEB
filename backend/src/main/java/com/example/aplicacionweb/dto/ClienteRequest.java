package com.example.aplicacionweb.dto;

public class ClienteRequest {
    private String nombreDiscord;
    private Long idDiscord;

    public String getNombreDiscord() { return nombreDiscord; }
    public void setNombreDiscord(String nombreDiscord) { this.nombreDiscord = nombreDiscord; }
    public Long getIdDiscord() { return idDiscord; }
    public void setIdDiscord(Long idDiscord) { this.idDiscord = idDiscord; }
}
