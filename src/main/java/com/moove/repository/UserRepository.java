
package com.moove.repository;


import com.moove.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

    List<User> findUserByUserId(String userId);

    List<User> findUserByUserEmail(String userEmail);

    List<User> findUserByUserPhone(String userPhone);

    List<User> findUserByUsername(String username);

}