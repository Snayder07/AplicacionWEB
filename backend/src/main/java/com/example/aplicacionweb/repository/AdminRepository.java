package com.negocio.backend.repository;
import com.negocio.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /**
     * Busca un administrador por su nombre de usuario.
     * Útil para el proceso de autenticación (Login).
     *
     * Spring Data JPA genera automáticamente el equivalente a:
     * SELECT * FROM Admin WHERE usuario = ?
     */
    Optional<Admin> findByUsuario(String usuario);
}