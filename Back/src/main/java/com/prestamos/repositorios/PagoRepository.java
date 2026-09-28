package com.prestamos.repositorios;

import com.prestamos.modelos.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByPrestamoIdAndPrestamistaId(Long prestamoId, Long prestamistaId);

    List<Pago> findByPrestamistaId(Long prestamistaId);
}