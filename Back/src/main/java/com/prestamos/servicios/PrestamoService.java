package com.prestamos.servicios;

import com.prestamos.modelos.Cliente;
import com.prestamos.modelos.Cuota;
import com.prestamos.modelos.Pago;
import com.prestamos.modelos.Prestamo;
import com.prestamos.modelosEnum.EstadoCuota;
import com.prestamos.modelosEnum.EstadoPrestamo;
import com.prestamos.modelosEnum.FrecuenciaPago;
import com.prestamos.modelosEnum.TipoPago;
import com.prestamos.repositorios.ClienteRepository;
import com.prestamos.repositorios.PagoRepository;
import com.prestamos.repositorios.PrestamoRepository;
import com.prestamos.repositorios.CuotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final PagoRepository pagoRepository;
    private final CuotaRepository cuotaRepository;

    public PrestamoService(PrestamoRepository prestamoRepository, ClienteRepository clienteRepository, PagoRepository pagoRepository, CuotaRepository cuotaRepository) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
        this.pagoRepository = pagoRepository;
        this.cuotaRepository = cuotaRepository;
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
        Prestamo prestamo = prestamoRepository.findByIdAndPrestamistaId(prestamoId, prestamistaId).orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

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
        Prestamo prestamo = prestamoRepository.findByIdAndPrestamistaId(prestamoId, prestamistaId).orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

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

    private void generarCronogramaCuotas(Prestamo prestamo, int cantidadCuotas, BigDecimal tasaInteres, FrecuenciaPago frecuencia, LocalDate fechaPrimerVencimiento) {
    BigDecimal interesTotal = prestamo.getMontoCapital().multiply(tasaInteres).divide(new BigDecimal("100"));
    BigDecimal montoTotal = prestamo.getMontoCapital().add(interesTotal);

    BigDecimal montoPorCuota = montoTotal.divide(new BigDecimal(cantidadCuotas), 2, java.math.RoundingMode.HALF_UP);

    LocalDate fechaCuota = fechaPrimerVencimiento;

    for (int i = 1; i <= cantidadCuotas; i++) {
        Cuota cuota = new Cuota();
        cuota.setPrestamistaId(prestamo.getPrestamistaId());
        cuota.setPrestamo(prestamo);
        cuota.setNumeroCuota(i);
        cuota.setMontoCuota(montoPorCuota);
        cuota.setFechaVencimiento(fechaCuota);
        cuota.setEstado(EstadoCuota.PENDIENTE);

        cuotaRepository.save(cuota);

        if (frecuencia == FrecuenciaPago.DIARIO) {
            fechaCuota = fechaCuota.plusDays(1);
        } else if (frecuencia == FrecuenciaPago.SEMANAL) {
            fechaCuota = fechaCuota.plusWeeks(1);
        } else if (frecuencia == FrecuenciaPago.QUINCENAL) {
            fechaCuota = fechaCuota.plusDays(15);
        } else if (frecuencia == FrecuenciaPago.MENSUAL) {
            fechaCuota = fechaCuota.plusMonths(1);
        }
    }
    }

}