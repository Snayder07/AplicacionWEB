package com.example.aplicacionweb.controller;

import com.example.aplicacionweb.dto.LoginRequest;
import com.example.aplicacionweb.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean valido = loginService.validarCredenciales(request.getUsuario(), request.getContrasena());
        if (valido) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Autenticación exitosa"));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Credenciales inválidas"));
    }
}
