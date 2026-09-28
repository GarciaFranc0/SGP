package com.prestamos.repositorios;

import com.prestamos.modelos.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrestadorRepository extends JpaRepository<Prestador, Long> {
    
    Optional<Prestador> findByEmail(String email);
    
    boolean existsByEmail(String email);
}