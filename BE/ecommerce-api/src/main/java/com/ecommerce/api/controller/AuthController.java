package com.ecommerce.api.controller;

import com.ecommerce.api.dto.LoginRequest;
import com.ecommerce.api.dto.RegisterRequest;
import com.ecommerce.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // User login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Optional<Map<String, Object>> response = authService.login(request);

        if (response.isPresent()) {
            return ResponseEntity.ok(response.get());
        }

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    // User registration
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        Optional<Map<String, Object>> response = authService.register(request);

        if (response.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response.get());
        }

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", "Email already exists");
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Check if email exists
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@PathVariable String email) {
        boolean exists = authService.checkEmailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // Logout (placeholder - in real app might invalidate tokens)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
