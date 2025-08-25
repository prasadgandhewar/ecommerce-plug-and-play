package com.ecommerce.api.service;

import com.ecommerce.api.dto.LoginRequest;
import com.ecommerce.api.dto.RegisterRequest;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Optional<Map<String, Object>> login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real application, you would verify the password hash
            if (user.getPassword().equals(request.getPassword()) && user.getIsActive()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("role", user.getRole().name());

                return Optional.of(response);
            }
        }

        return Optional.empty();
    }

    public Optional<Map<String, Object>> register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return Optional.empty();
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In real app, encrypt this
        user.setPhone(request.getPhone());
        user.setRole(User.Role.USER);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", savedUser.getId());
        response.put("email", savedUser.getEmail());
        response.put("firstName", savedUser.getFirstName());
        response.put("lastName", savedUser.getLastName());

        return Optional.of(response);
    }

    public boolean checkEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<Map<String, Object>> refreshToken(String refreshToken) {
        // Placeholder for JWT refresh token implementation
        // In a real application, you would validate the refresh token
        // and generate new access token
        return Optional.empty();
    }

    public boolean validateToken(String token) {
        // Placeholder for JWT token validation
        // In a real application, you would validate the JWT token
        return token != null && !token.isEmpty();
    }

    public Optional<Map<String, Object>> getUserProfile(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getIsActive()) {
                Map<String, Object> profile = new HashMap<>();
                profile.put("userId", user.getId());
                profile.put("email", user.getEmail());
                profile.put("firstName", user.getFirstName());
                profile.put("lastName", user.getLastName());
                profile.put("phone", user.getPhone());
                profile.put("role", user.getRole().name());
                profile.put("createdAt", user.getCreatedAt());
                profile.put("updatedAt", user.getUpdatedAt());
                
                return Optional.of(profile);
            }
        }
        
        return Optional.empty();
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real application, you would hash and verify passwords
            if (user.getPassword().equals(oldPassword) && user.getIsActive()) {
                user.setPassword(newPassword); // In real app, hash this
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }

    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getIsActive()) {
                user.setPassword(newPassword); // In real app, hash this
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }
}
