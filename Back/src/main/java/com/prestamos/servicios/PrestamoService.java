package com.prestamos.servicios;

import com.prestamos.modelos.Cliente;
import com.prestamos.modelos.Pago;
import com.prestamos.modelos.Prestamo;
import com.prestamos.modelosEnum.EstadoPrestamo;
import com.prestamos.modelosEnum.FrecuenciaPago;
import com.prestamos.modelosEnum.TipoPago;
import com.prestamos.repositorios.ClienteRepository;
import com.prestamos.repositorios.PagoRepository;
import com.prestamos.repositorios.PrestamoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final PagoRepository pagoRepository;

    public PrestamoService(PrestamoRepository prestamoRepository, ClienteRepository clienteRepository, PagoRepository pagoRepository) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
        this.pagoRepository = pagoRepository;
    }

    @Transactional
    public Prestamo crearPrestamo(Long prestamistaId, Long clienteId, BigDecimal montoCapital, BigDecimal porcentajeRecargo, FrecuenciaPago frecuencia) {
        
        Cliente cliente = clienteRepository.findByIdAndPrestamistaId(clienteId, prestamistaId).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        BigDecimal factorRecargo = porcentajeRecargo.divide(new BigDecimal("100")).add(BigDecimal.ONE);
        BigDecimal montoTotalInicial = montoCapital.multiply(factorRecargo);

        Prestamo prestamo = new Prestamo();
        prestamo.setPrestamistaId(prestamistaId);
        prestamo.setCliente(cliente);
        prestamo.setMontoCapital(montoCapital);
        prestamo.setPorcentajeRecargo(porcentajeRecargo);
        prestamo.setMontoTotalActual(montoTotalInicial);
        prestamo.setFrecuencia(frecuencia);
        prestamo.setFechaInicio(LocalDateTime.now());
        prestamo.setFechaVencimiento(calcularProximoVencimiento(LocalDateTime.now(), frecuencia));
        prestamo.setCantidadRenovaciones(0);
        prestamo.setEstado(EstadoPrestamo.ACTIVO);

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);
        return prestamoGuardado;
    }

    @Transactional
    public Pago renovarPrestamo(Long prestamoId, Long prestamistaId, BigDecimal montoAbonado) {
        Prestamo prestamo = prestamoRepository.findByIdAndPrestamistaId(prestamoId, prestamistaId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        prestamo.setFechaVencimiento(calcularProximoVencimiento(prestamo.getFechaVencimiento(), prestamo.getFrecuencia()));
        prestamo.setCantidadRenovaciones(prestamo.getCantidadRenovaciones() + 1);
        prestamo.setEstado(EstadoPrestamo.ACTIVO);
        
        prestamoRepository.save(prestamo);

        Pago pago = new Pago();
        pago.setPrestamistaId(prestamistaId);
        pago.setPrestamo(prestamo);
        pago.setMontoPagado(montoAbonado);
        pago.setTipoPago(TipoPago.RENOVACION_INTERESES);
        pago.setFechaPago(LocalDateTime.now());

        Pago pagoGuardado = pagoRepository.save(pago);
        return pagoGuardado;
    }

    @Transactional
    public Pago cancelarPrestamoTotal(Long prestamoId, Long prestamistaId, BigDecimal montoAbonado) {
        Prestamo prestamo = prestamoRepository.findByIdAndPrestamistaId(prestamoId, prestamistaId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        prestamo.setEstado(EstadoPrestamo.CANCELADO);
        prestamoRepository.save(prestamo);

        Pago pago = new Pago();
        pago.setPrestamistaId(prestamistaId);
        pago.setPrestamo(prestamo);
        pago.setMontoPagado(montoAbonado);
        pago.setTipoPago(TipoPago.CANCELACION_TOTAL);
        pago.setFechaPago(LocalDateTime.now());

        Pago pagoGuardado = pagoRepository.save(pago);
        return pagoGuardado;
    }

    public List<Prestamo> obtenerPrestamosPorPrestamista(Long prestamistaId) {
        List<Prestamo> prestamos = prestamoRepository.findByPrestamistaId(prestamistaId);
        return prestamos;
    }

    private LocalDateTime calcularProximoVencimiento(LocalDateTime fechaBase, FrecuenciaPago frecuencia) {
        LocalDateTime nuevaFecha = switch (frecuencia) {
            case DIARIO -> fechaBase.plusDays(1);
            case SEMANAL -> fechaBase.plusWeeks(1);
            case QUINCENAL -> fechaBase.plusWeeks(2);
            case MENSUAL -> fechaBase.plusMonths(1);
        };
        return nuevaFecha;
    }
}