package com.snackhunt.snackhunt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.snackhunt.snackhunt"})
public class SnackhuntApplication {
    public static void main(String[] args) {
        SpringApplication.run(SnackhuntApplication.class, args);
    }
}
