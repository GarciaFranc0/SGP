package com.prestamos.controladores;

import com.prestamos.modelos.Cliente;
import com.prestamos.servicios.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes(@RequestParam Long prestamistaId) {
        List<Cliente> clientes = clienteService.obtenerClientesPorPrestamista(prestamistaId);
        ResponseEntity<List<Cliente>> respuesta = ResponseEntity.ok(clientes);
        return respuesta;
    }

    @PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente, @RequestParam Long prestamistaId) {
        Cliente nuevoCliente = clienteService.crearCliente(cliente, prestamistaId);
        ResponseEntity<Cliente> respuesta = ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
        return respuesta;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id, @RequestParam Long prestamistaId) {
        Cliente cliente = clienteService.obtenerClientePorId(id, prestamistaId);
        ResponseEntity<Cliente> respuesta = ResponseEntity.ok(cliente);
        return respuesta;
    }
}