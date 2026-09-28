package com.prestamos.servicios;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 86400000; 

    public String generarToken(Long prestamistaId, String email) {
        String token = Jwts.builder().setSubject(email).claim("prestamistaId", prestamistaId).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(SECRET_KEY).compact();
        return token;
    }

    public String obtenerEmailDelToken(String token) {
        String email = obtenerClaims(token).getSubject();
        return email;
    }

    public Long obtenerPrestamistaIdDelToken(String token) {
        Long prestamistaId = obtenerClaims(token).get("prestamistaId", Long.class);
        return prestamistaId;
    }

    public boolean esTokenValido(String token) {
        boolean valido = false;
        try {
            Date expiration = obtenerClaims(token).getExpiration();
            valido = !expiration.before(new Date());
        } catch (Exception e) {
            valido = false;
        }
        return valido;
    }

    private Claims obtenerClaims(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claims;
    }
}