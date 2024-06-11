package com.openclassrooms.starterjwt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class dotenvConfig {

    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure().load();
    } 
}
