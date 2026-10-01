package com.safe.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // desactivar csrf
            .csrf(csrf -> csrf.disable())

            // JWT = sin sesiones
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // permisos
            .authorizeHttpRequests(auth -> auth

                // rutas públicas
                .requestMatchers(
                        "/usuario/login",
                        "/usuario/register",
                        "/puestos"
                ).permitAll()

                // ADMIN
                .requestMatchers("/admin/**")
                .hasAnyRole("ADMIN", "RRHH")

                // POSTULANTE
                .requestMatchers("/postulante/**")
                .hasRole("POSTULANTE")

                // cualquier otra requiere login
                .anyRequest().authenticated()
            )

            // desactivar login de spring
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // filtro JWT
            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
