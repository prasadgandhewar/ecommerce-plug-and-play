package com.ecommerce.api.controller;

import com.ecommerce.api.dto.RegisterRequest;
import com.ecommerce.api.dto.UserResponse;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users with pagination
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserResponse> users = userService.getAllUsers(pageable);

        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<UserResponse> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create new user (registration)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        Optional<UserResponse> user = userService.createUser(request);
        return user.map(u -> ResponseEntity.status(HttpStatus.CREATED).body(u))
                   .orElse(ResponseEntity.badRequest().build());
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest request) {
        Optional<UserResponse> user = userService.updateUser(id, request);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Delete user (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        Optional<UserResponse> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());
        List<UserResponse> users = userService.getUsersByRole(userRole);
        return ResponseEntity.ok(users);
    }
}
