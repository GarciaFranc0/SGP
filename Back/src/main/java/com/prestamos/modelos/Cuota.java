package com.prestamos.modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prestamos.modelosEnum.EstadoCuota;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cuotas")
@Getter
@Setter
public class Cuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prestamista_id", nullable = false)
    private Long prestamistaId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;

    @Column(nullable = false)
    private Integer numeroCuota;

    @Column(nullable = false)
    private BigDecimal montoCuota;

    @Column(nullable = false)
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;

    private LocalDate fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuota estado = EstadoCuota.PENDIENTE;
}