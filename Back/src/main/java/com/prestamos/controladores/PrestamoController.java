package com.prestamos.controladores;

import com.prestamos.modelos.Pago;
import com.prestamos.modelos.Prestamo;
import com.prestamos.modelosEnum.FrecuenciaPago;
import com.prestamos.servicios.PrestamoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public ResponseEntity<List<Prestamo>> listarPrestamos(@RequestParam Long prestamistaId) {
        List<Prestamo> prestamos = prestamoService.obtenerPrestamosPorPrestamista(prestamistaId);
        ResponseEntity<List<Prestamo>> respuesta = ResponseEntity.ok(prestamos);
        return respuesta;
    }

    @PostMapping
    public ResponseEntity<Prestamo> crearPrestamo(@RequestParam Long prestamistaId, @RequestParam Long clienteId, @RequestParam BigDecimal montoCapital, @RequestParam BigDecimal porcentajeRecargo, @RequestParam FrecuenciaPago frecuencia) {    
        Prestamo nuevoPrestamo = prestamoService.crearPrestamo(prestamistaId, clienteId, montoCapital, porcentajeRecargo, frecuencia);
        ResponseEntity<Prestamo> respuesta = ResponseEntity.status(HttpStatus.CREATED).body(nuevoPrestamo);
        return respuesta;
    }

    @PostMapping("/{id}/renovar")
    public ResponseEntity<Pago> renovarPrestamo(@PathVariable Long id, @RequestParam Long prestamistaId, @RequestParam BigDecimal montoAbonado) {       
        Pago pagoRenovacion = prestamoService.renovarPrestamo(id, prestamistaId, montoAbonado);
        ResponseEntity<Pago> respuesta = ResponseEntity.ok(pagoRenovacion);
        return respuesta;
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Pago> cancelarPrestamo(@PathVariable Long id, @RequestParam Long prestamistaId, @RequestParam BigDecimal montoAbonado) {       
        Pago pagoCancelacion = prestamoService.cancelarPrestamoTotal(id, prestamistaId, montoAbonado);
        ResponseEntity<Pago> respuesta = ResponseEntity.ok(pagoCancelacion);
        return respuesta;
    }
}