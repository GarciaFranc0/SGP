package com.prestamos.servicios;

import com.prestamos.dto.AuthResponse;
import com.prestamos.dto.LoginRequest;
import com.prestamos.dto.RegistroRequest;
import com.prestamos.modelos.Prestador;
import com.prestamos.repositorios.PrestadorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PrestadorRepository prestadorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(PrestadorRepository prestadorRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.prestadorRepository = prestadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registrar(RegistroRequest request) {
        if (prestadorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya esta registrado");
        }

        Prestador prestador = new Prestador();
        prestador.setNombre(request.getNombre());
        prestador.setEmail(request.getEmail());
        prestador.setPassword(passwordEncoder.encode(request.getPassword()));

        Prestador prestadorGuardado = prestadorRepository.save(prestador);
        String token = jwtService.generarToken(prestadorGuardado.getId(), prestadorGuardado.getEmail());

        AuthResponse respuesta = new AuthResponse(token, prestadorGuardado.getId(), prestadorGuardado.getNombre(), prestadorGuardado.getEmail());
        return respuesta;
    }

    public AuthResponse login(LoginRequest request) {
        Prestador prestador = prestadorRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), prestador.getPassword())) {
            throw new RuntimeException("Credenciales invalidas");
        }

        String token = jwtService.generarToken(prestador.getId(), prestador.getEmail());

        AuthResponse respuesta = new AuthResponse(token, prestador.getId(), prestador.getNombre(), prestador.getEmail());
        return respuesta;
    }
}