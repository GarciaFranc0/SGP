package com.prestamos.modelos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "prestadores")
@Getter
@Setter
public class Prestador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "contrasena_hash", nullable = false)
    private String password;

    @Column(name = "moneda_pref")
    private String monedaPref;

    @Column(name = "plantilla_whatsapp", columnDefinition = "TEXT")
    private String plantillaWhatsapp;

    public Prestador() {
    }

    public Prestador(String nombre, String email, String password, String monedaPref, String plantillaWhatsapp) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.monedaPref = monedaPref;
        this.plantillaWhatsapp = plantillaWhatsapp;
    }
}