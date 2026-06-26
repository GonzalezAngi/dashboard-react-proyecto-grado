package com.backend.backend.Authentication;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;



//@EnableMethodSecurity
@EnableMethodSecurity(prePostEnabled = true)

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                    .requestMatchers("/error").permitAll()
                    .requestMatchers("/especialidad/v1/mas-solicitadas").permitAll()
                    .requestMatchers("/cita/v1/barrios-mas-solicitados").permitAll()
                    .requestMatchers("/cita/v1/citas-por-mes").permitAll()
                    .requestMatchers("/cita/v1/citas-por-mes-por-estado").permitAll()
                    .requestMatchers("/cita/v1/citas-por-estado").permitAll()
                    .requestMatchers("/cita/v1/estadisticas/citas-por-estado").permitAll()
                    .requestMatchers("/cita/v1/tipos-cita-mas-solicitados").permitAll()
                    .requestMatchers("/cita/v1/motivos-consulta-mas-frecuentes").permitAll()
                    .requestMatchers("/cita/v1/medios-pago-mas-solicitados").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}

