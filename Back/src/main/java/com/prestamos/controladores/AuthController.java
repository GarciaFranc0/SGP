package com.prestamos.controladores;

import com.prestamos.dto.AuthResponse;
import com.prestamos.dto.LoginRequest;
import com.prestamos.dto.RegistroRequest;
import com.prestamos.servicios.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@RequestBody RegistroRequest request) {
        AuthResponse respuestaAuth = authService.registrar(request);
        ResponseEntity<AuthResponse> respuesta = ResponseEntity.status(HttpStatus.CREATED).body(respuestaAuth);
        return respuesta;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse respuestaAuth = authService.login(request);
        ResponseEntity<AuthResponse> respuesta = ResponseEntity.ok(respuestaAuth);
        return respuesta;
    }
}