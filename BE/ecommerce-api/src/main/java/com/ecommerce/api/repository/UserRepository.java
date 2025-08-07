package com.ecommerce.api.repository;

import com.ecommerce.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Page<User> findByIsActiveTrue(Pageable pageable);

    List<User> findByRoleAndIsActiveTrue(User.Role role);

    List<User> findByIsActiveTrue();

    boolean existsByEmail(String email);
}
