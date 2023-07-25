package com.dh.clinica.service;

import com.dh.clinica.model.AppUser;
import com.dh.clinica.model.AppUserRole;
import com.dh.clinica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {

    private UserRepository userRepository;

    @Autowired
    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void run(ApplicationArguments args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode("vic");
        BCryptPasswordEncoder passwordEncoder2 = new BCryptPasswordEncoder();
        String hashedPassword2 = passwordEncoder2.encode("pau");
        userRepository.save(new AppUser("vic", "vic", "vic", hashedPassword, AppUserRole.ADMIN));
        userRepository.save(new AppUser("pau", "pau", "pau", hashedPassword2, AppUserRole.USER));
    }
}
