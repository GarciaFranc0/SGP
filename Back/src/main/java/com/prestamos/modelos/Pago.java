package com.prestamos.modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prestamos.modelosEnum.TipoPago;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prestamista_id", nullable = false)
    private Long prestamistaId;

    @JsonIgnore 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;

    @Column(name = "monto_pagado", nullable = false)
    private BigDecimal montoPagado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago", nullable = false)
    private TipoPago tipoPago;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago;

    public Pago() {
    }

    public Pago(Long prestamistaId, Prestamo prestamo, BigDecimal montoPagado, TipoPago tipoPago, LocalDateTime fechaPago) {
        this.prestamistaId = prestamistaId;
        this.prestamo = prestamo;
        this.montoPagado = montoPagado;
        this.tipoPago = tipoPago;
        this.fechaPago = fechaPago;
    }
}