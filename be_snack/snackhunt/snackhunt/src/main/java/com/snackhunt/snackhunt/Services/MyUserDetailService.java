package com.snackhunt.snackhunt.Services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Models.MyUserDetails;
import com.snackhunt.snackhunt.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyUserDetailService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()){
            return new MyUserDetails(user.get());
        }

        throw new UsernameNotFoundException("Username tidak ditemukan");
    }
}
