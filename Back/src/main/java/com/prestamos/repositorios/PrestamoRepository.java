package com.prestamos.repositorios;

import com.prestamos.modelos.Prestamo;
import com.prestamos.modelosEnum.EstadoPrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    List<Prestamo> findByPrestamistaId(Long prestamistaId);

    List<Prestamo> findByPrestamistaIdAndEstado(Long prestamistaId, EstadoPrestamo estado);

    Optional<Prestamo> findByIdAndPrestamistaId(Long id, Long prestamistaId);
}