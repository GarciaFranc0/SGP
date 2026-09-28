package com.prestamos.repositorios;

import com.prestamos.modelos.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByPrestamistaId(Long prestamistaId);

    Optional<Cliente> findByIdAndPrestamistaId(Long id, Long prestamistaId);
}