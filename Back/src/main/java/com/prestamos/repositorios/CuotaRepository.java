package com.prestamos.repositorios;

import com.prestamos.modelos.Cuota;
import com.prestamos.modelosEnum.EstadoCuota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CuotaRepository extends JpaRepository<Cuota, Long> {

    List<Cuota> findByPrestamoIdOrderByNumeroCuotaAsc(Long prestamoId);

    List<Cuota> findByPrestamistaIdAndFechaVencimiento(Long prestamistaId, LocalDate fecha);

    List<Cuota> findByPrestamistaIdAndEstado(Long prestamistaId, EstadoCuota estado);

    List<Cuota> findByPrestamistaIdAndFechaVencimientoBeforeAndEstado(Long prestamistaId, LocalDate fecha, EstadoCuota estado);
}