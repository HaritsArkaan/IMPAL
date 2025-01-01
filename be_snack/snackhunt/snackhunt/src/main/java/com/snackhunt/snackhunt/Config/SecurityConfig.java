package com.snackhunt.snackhunt.Config;

import com.snackhunt.snackhunt.Services.MyUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final MyUserDetailService userDetailService;
    private static final String[] WHITE_LIST_URL = {
            "/api/auth/**",
            "/users/**",
            "/api/snacks/get/**",
            "/api/snacks/images/**",
            "/reviews/snack/**",
            "/reviews",
            "/reviews/statistics/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/chatbot",
            "/stream",
            "/chat.html",
            "/chat",
            "/messages/**",
            "/js/**",
            "/user",
            "/queue",
            "/app",
            "/img/**",
            "/api/users/**",
            "/api/users/status/**",
            "/ws/**",
            "/css/**",
            "/stream.html"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(customizer -> customizer.disable())
                .cors(customizer -> customizer.configurationSource(corsConfigurationSource())) // Tambahkan ini untuk mengaktifkan CORS
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                .requestMatchers("POST", "/api/snacks").hasAuthority("USER")
                                .requestMatchers("GET", "/api/snacks/user/**").hasAuthority("USER")
                                .requestMatchers("PUT", "/api/snacks/**").hasAuthority("USER")
                                .requestMatchers("DELETE", "/api/snacks/**").hasAuthority("USER")

                                .requestMatchers("GET", "/favorities").hasAuthority("USER")
                                .requestMatchers("POST", "/favorities").hasAuthority("USER")
                                .requestMatchers("PUT", "/favorities/**").hasAuthority("USER")
                                .requestMatchers("DELETE", "/favorities/**").hasAuthority("USER")

                                .requestMatchers("POST", "/reviews").hasAuthority("USER")
                                .requestMatchers("PUT", "/reviews/**").hasAuthority("USER")
                                .requestMatchers("DELETE", "/reviews/**").hasAuthority("USER")

                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
