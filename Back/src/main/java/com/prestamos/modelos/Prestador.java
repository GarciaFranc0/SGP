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
    private String contrasenaHash;

    @Column(name = "moneda_pref")
    private String monedaPref;

    @Column(name = "plantilla_whatsapp", columnDefinition = "TEXT")
    private String plantillaWhatsapp;

    public Prestador() {
    }

    public Prestador(String nombre, String email, String contrasenaHash, String monedaPref, String plantillaWhatsapp) {
        this.nombre = nombre;
        this.email = email;
        this.contrasenaHash = contrasenaHash;
        this.monedaPref = monedaPref;
        this.plantillaWhatsapp = plantillaWhatsapp;
    }
}