package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtils jwtUtils;

    private static final String email = "user@example.com";
    private static final String password = "password123";
    private static final String firstName = "Toto";
    private static final String lastName = "Toto";
    private static final Long id = 1L;
    private static final boolean admin = true;
    private static final String jwtToken = "mockedJwtToken";

    private static UserDetailsImpl userDetails;
    private static User user;

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeAll
    public static void setUp() {
        userDetails = new UserDetailsImpl(id, email, firstName, lastName, admin, password);

        user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(password);
        user.setAdmin(admin);
    }

    @Nested
    class LoginTests {

        @Test
        public void shouldLoginUser() throws Exception {
            when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

            when(authenticationManager.authenticate(any()))
                    .thenReturn(authentication);

            when(jwtUtils.generateJwtToken(any())).thenReturn(jwtToken);

            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmail(email);
            loginRequest.setPassword(password);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest))
                            .with(csrf()))

                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").value(jwtToken))
                    .andExpect(jsonPath("$.id").value(id))
                    .andExpect(jsonPath("$.firstName").value(firstName))
                    .andExpect(jsonPath("$.lastName").value(lastName))
                    .andExpect(jsonPath("$.admin").value(admin));

            verify(userRepository, times(1)).findByEmail(email);
            verify(authenticationManager, times(1)).authenticate(any());
            verify(jwtUtils, times(1)).generateJwtToken(any());
        }
    }

    @Nested
    class RegisterTests {

        @Test
        public void shouldRegisterUser() throws Exception {
            when(userRepository.existsByEmail(email)).thenReturn(false);

            when(userRepository.save(user)).thenReturn(user);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(user))
                            .with(csrf()))

                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.message").value("User registered successfully!"));


            verify(userRepository, times(1)).existsByEmail(email);
        }

        @Test
        public void shouldNotRegisterUser() throws Exception {
            when(userRepository.existsByEmail(email)).thenReturn(true);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(user))
                            .with(csrf()))

                    .andExpect(status().isBadRequest())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));

            verify(userRepository, times(1)).existsByEmail(email);
            verify(userRepository, never()).save(user);
        }
    }
}