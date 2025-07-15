package com.moove.service;


import com.moove.model.User;
import com.moove.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by userId
    public Optional<User> getUserById(String userId) {
        return userRepository.findUserByUserId(userId).stream().findFirst();
    }

    // Get user by email
    public Optional<User> getUserByUserEmail(String userEmail) {
        return userRepository.findUserByUserEmail(userEmail).stream().findFirst();
    }

    // Get user by phone
    public Optional<User> getUserByUserPhone(String userPhone) {
        return userRepository.findUserByUserPhone(userPhone).stream().findFirst();
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findUserByUsername(username).stream().findFirst();
    }

    // Get users by storeId (if store relation exists)
    public List<User> getUsersByStoreId(Long storeId) {
        return userRepository.findUserByStore_StoreId(storeId);
    }

    // Save or update user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Delete user by ID
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
