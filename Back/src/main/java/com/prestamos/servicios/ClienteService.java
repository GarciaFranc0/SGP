package com.prestamos.servicios;

import com.prestamos.modelos.Cliente;
import com.prestamos.modelosEnum.EstadoCliente;
import com.prestamos.repositorios.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> obtenerClientesPorPrestamista(Long prestamistaId) {
        return clienteRepository.findByPrestamistaId(prestamistaId);
    }

    public Cliente crearCliente(Cliente cliente, Long prestamistaId) {
        cliente.setPrestamistaId(prestamistaId);
        cliente.setEstado(EstadoCliente.ACTIVO);
        return clienteRepository.save(cliente);
    }

    public Cliente obtenerClientePorId(Long id, Long prestamistaId) {
        return clienteRepository.findByIdAndPrestamistaId(id, prestamistaId).orElseThrow(() -> new RuntimeException("Cliente no encontrado o no autorizado"));
    }
}