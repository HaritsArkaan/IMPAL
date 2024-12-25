package com.snackhunt.snackhunt.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Repositories.*;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String registerUser(User user){
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()){
            return "Username already exists";
        }
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole(user.getRole());
        user.setId(sequenceGeneratorService.generateSequence(User.SEQUENCE_NAME));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String loginUser(String username, String password){
        // Check di User
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return jwtService.generateToken(new MyUserDetails(user.get()));
        }

        throw new RuntimeException("Username atau Password salah");
    }
}