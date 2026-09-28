package com.prestamos.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroRequest {
    private String nombre;
    private String email;
    private String password;
}