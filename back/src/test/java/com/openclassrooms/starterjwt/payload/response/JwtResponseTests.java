package com.openclassrooms.payload.response;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class JwtResponseTests {

    @Mock
    private JwtResponse jwtResponse;

    private String token;
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private Boolean admin;


    @BeforeEach
    void setUp() {
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        id = 1L;
        username = "totolerigolo";
        firstName = "Toto";
        lastName = "Toto";
        admin = false;

        jwtResponse = new JwtResponse(token, id, username, firstName, lastName, admin);
    }

    @Test
    void shouldSetAndGetToken() {
        jwtResponse.setToken(token);

        assertEquals(token, jwtResponse.getToken());
    }

    @Test
    void shouldSetAndGetType() {
        jwtResponse.setType("Bearer");

        assertEquals("Bearer", jwtResponse.getType());
    }

    @Test
    void shouldSetAndGetId() {
        jwtResponse.setId(id);

        assertEquals(id, jwtResponse.getId());
    }

    @Test
    void shouldSetAndGetUsername() {
        jwtResponse.setUsername(username);

        assertEquals(username, jwtResponse.getUsername());
    }

    @Test
    void shouldSetAndGetFirstName() {
        jwtResponse.setFirstName(firstName);

        assertEquals(firstName, jwtResponse.getFirstName());
    }

    @Test
    void shouldSetAndGetLastName() {
        jwtResponse.setLastName(lastName);

        assertEquals(lastName, jwtResponse.getLastName());
    }

    @Test
    void shouldSetAndGetAdmin() {
        jwtResponse.setAdmin(admin);

        assertEquals(admin, jwtResponse.getAdmin());
    }

}
