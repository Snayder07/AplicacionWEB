package com.example.aplicacionweb.service;

import com.example.aplicacionweb.model.Admin;
import com.example.aplicacionweb.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * LoginService
 * ────────────
 * Servicio responsable de autenticar al administrador.
 *
 * ¿DÓNDE ESTÁ EL USUARIO Y CONTRASEÑA?
 * En la tabla "Admin" de tu base de datos Supabase (PostgreSQL).
 * La tabla tiene tres columnas: id_admin, usuario, Contrasena.
 *
 * Para agregar tu usuario administrador, ejecuta en Supabase → SQL Editor:
 *
 *   INSERT INTO "Admin" (usuario, "Contrasena")
 *   VALUES ('tu_usuario', 'tu_contrasena');
 *
 * IMPORTANTE: Actualmente la contraseña se guarda en texto plano
 * (tal como está en tu modelo Admin.java). Si en el futuro quieres
 * añadir hashing con BCrypt, el método validarCredenciales() es el
 * único lugar que deberías modificar.
 *
 * FLUJO:
 *   LoginController llama a validarCredenciales(usuario, contrasena)
 *   → Busca en la BD por username usando AdminRepository
 *   → Compara la contraseña recibida con la almacenada
 *   → Retorna true si coinciden, false si no
 */
@Service
public class LoginService {

    private final AdminRepository adminRepository;

    public LoginService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    /**
     * Valida si el usuario y contraseña existen y coinciden en la tabla Admin.
     *
     * @param usuario    Texto ingresado en el campo Usuario del Login
     * @param contrasena Texto ingresado en el campo Contraseña del Login
     * @return true si las credenciales son válidas, false si no
     */
    public boolean validarCredenciales(String usuario, String contrasena) {
        if (usuario == null || usuario.isBlank() ||
                contrasena == null || contrasena.isBlank()) {
            return false;
        }

        // Busca al admin por su nombre de usuario en la tabla Admin
        Optional<Admin> adminOpt = adminRepository.findByUsuario(usuario.trim());

        if (adminOpt.isEmpty()) {
            return false; // Usuario no encontrado
        }

        Admin admin = adminOpt.get();

        // Compara la contraseña ingresada con la almacenada
        // (comparación en texto plano, igual que tu modelo actual)
        return contrasena.equals(admin.getContrasena());
    }
}
