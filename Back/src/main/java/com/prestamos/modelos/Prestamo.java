package com.prestamos.modelos;

import com.prestamos.modelosEnum.EstadoPrestamo;
import com.prestamos.modelosEnum.FrecuenciaPago;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamos")
@Getter
@Setter
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prestamista_id", nullable = false)
    private Long prestamistaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "monto_capital", nullable = false)
    private BigDecimal montoCapital;

    @Column(name = "porcentaje_recargo", nullable = false)
    private BigDecimal porcentajeRecargo;

    @Column(name = "monto_total_actual", nullable = false)
    private BigDecimal montoTotalActual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FrecuenciaPago frecuencia;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDateTime fechaVencimiento;

    @Column(name = "cantidad_renovaciones", nullable = false)
    private Integer cantidadRenovaciones;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPrestamo estado;

    public Prestamo() {
    }

    public Prestamo(Long prestamistaId, Cliente cliente, BigDecimal montoCapital, BigDecimal porcentajeRecargo, BigDecimal montoTotalActual, FrecuenciaPago frecuencia, LocalDateTime fechaInicio, LocalDateTime fechaVencimiento, Integer cantidadRenovaciones, EstadoPrestamo estado) {
        this.prestamistaId = prestamistaId;
        this.cliente = cliente;
        this.montoCapital = montoCapital;
        this.porcentajeRecargo = porcentajeRecargo;
        this.montoTotalActual = montoTotalActual;
        this.frecuencia = frecuencia;
        this.fechaInicio = fechaInicio;
        this.fechaVencimiento = fechaVencimiento;
        this.cantidadRenovaciones = cantidadRenovaciones;
        this.estado = estado;
    }
}