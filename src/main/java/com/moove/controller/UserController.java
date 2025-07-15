package com.moove.controller;


import com.moove.entity.User;
import com.moove.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Enable CORS for frontend
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by userId
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable("userId")String userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get user by email
    @GetMapping("/email/{userEmail}")
    public ResponseEntity<User> getUserByEmail(@PathVariable("userEmail") String userEmail) {
        Optional<User> user = userService.getUserByUserEmail(userEmail);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    // Get user by phone
    @GetMapping("/userPhone/{userPhone}")
    public ResponseEntity<User> getUserByUserPhone(@PathVariable("userPhone") String phone) {
        Optional<User> user = userService.getUserByUserPhone(phone);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable("username") String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get all users by storeId (if applicable)
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<User>> getUsersByStoreId(@PathVariable("storeId") Long storeId) {
        List<User> users = userService.getUsersByStoreId(storeId);
        return ResponseEntity.ok(users);
    }

    // Add or update a user
    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // Delete a user by ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
