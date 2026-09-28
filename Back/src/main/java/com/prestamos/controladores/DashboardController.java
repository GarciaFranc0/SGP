package com.prestamos.controladores;

import com.prestamos.modelos.Cuota;
import com.prestamos.modelosEnum.EstadoCuota;
import com.prestamos.repositorios.CuotaRepository;
import com.prestamos.repositorios.PrestamoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final CuotaRepository cuotaRepository;
    private final PrestamoRepository prestamoRepository;

    public DashboardController(CuotaRepository cuotaRepository, PrestamoRepository prestamoRepository) {
        this.cuotaRepository = cuotaRepository;
        this.prestamoRepository = prestamoRepository;
    }

    @GetMapping("/metricas")
    public ResponseEntity<Map<String, Object>> obtenerMetricas(@RequestParam Long prestamistaId) {
        Map<String, Object> respuesta = new HashMap<>();

        LocalDate hoy = LocalDate.now();
        List<Cuota> cuotasHoy = cuotaRepository.findByPrestamistaIdAndFechaVencimiento(prestamistaId, hoy);
        List<Cuota> cuotasEnMora = cuotaRepository.findByPrestamistaIdAndEstado(prestamistaId, EstadoCuota.VENCIDA);

        respuesta.put("cuotasVencenHoyCount", cuotasHoy.size());
        respuesta.put("cuotasEnMoraCount", cuotasEnMora.size());
        respuesta.put("totalPrestamosActivos", prestamoRepository.findByPrestamistaId(prestamistaId).size());

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/alertas-diarias")
    public ResponseEntity<Map<String, Object>> obtenerAlertasDiarias(@RequestParam Long prestamistaId) {
        Map<String, Object> alertas = new HashMap<>();
        LocalDate hoy = LocalDate.now();

        List<Cuota> cuotasHoy = cuotaRepository.findByPrestamistaIdAndFechaVencimiento(prestamistaId, hoy);
        List<Cuota> cuotasManana = cuotaRepository.findByPrestamistaIdAndFechaVencimiento(prestamistaId, hoy.plusDays(1));
        List<Cuota> cuotasMora = cuotaRepository.findByPrestamistaIdAndFechaVencimientoBeforeAndEstado(prestamistaId, hoy, EstadoCuota.PENDIENTE);

        alertas.put("vencenHoy", cuotasHoy);
        alertas.put("vencenManana", cuotasManana);
        alertas.put("vencidasEnMora", cuotasMora);

        return ResponseEntity.ok(alertas);
    }
}