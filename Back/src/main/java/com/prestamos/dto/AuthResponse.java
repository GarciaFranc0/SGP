package com.prestamos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long prestamistaId;
    private String nombre;
    private String email;
}