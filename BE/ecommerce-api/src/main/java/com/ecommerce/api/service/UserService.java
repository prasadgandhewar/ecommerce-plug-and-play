package com.ecommerce.api.service;

import com.ecommerce.api.dto.RegisterRequest;
import com.ecommerce.api.dto.UserResponse;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findByIsActiveTrue(pageable);
        return users.map(this::convertToResponse);
    }

    public Optional<UserResponse> getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.filter(u -> u.getIsActive()).map(this::convertToResponse);
    }

    public Optional<UserResponse> createUser(RegisterRequest request) {
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
        return Optional.of(convertToResponse(savedUser));
    }

    public Optional<UserResponse> updateUser(Long id, RegisterRequest request) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone());

            User updatedUser = userRepository.save(user);
            return Optional.of(convertToResponse(updatedUser));
        }
        return Optional.empty();
    }

    public boolean deleteUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setIsActive(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public Optional<UserResponse> getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.filter(u -> u.getIsActive()).map(this::convertToResponse);
    }

    public List<UserResponse> getUsersByRole(User.Role role) {
        List<User> users = userRepository.findByRoleAndIsActiveTrue(role);
        return users.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
