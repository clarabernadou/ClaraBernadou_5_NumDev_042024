package com.openclassrooms.starterjwt.payload.request;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@ExtendWith(MockitoExtension.class)
public class LoginRequestTests {

    private Validator validator;

    @Mock
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        loginRequest = new LoginRequest();
    }

    @Nested
    class EmailTests {
        @Test
        void shouldSetAndGetEmail() {
            String email = "test@test.fr";
            loginRequest.setEmail(email);

            assertEquals(email, loginRequest.getEmail());
        }

        @Test
        void shouldSetAndGetEmailIsBlank() {
            loginRequest.setEmail("");

            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
            assertFalse(violations.isEmpty());
        }

        @Test
        void shouldSetAndGetEmailIsNull() {
            loginRequest.setEmail(null);

            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
            assertFalse(violations.isEmpty());
        }
    }

    @Nested
    class PasswordTests {
        @Test
        void shouldSetAndGetPassword() {
            String password = "password";
            loginRequest.setPassword(password);

            assertEquals(password, loginRequest.getPassword());
        }

        @Test
        void shouldSetAndGetPasswordIsBlank() {
            loginRequest.setPassword("");

            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
            assertFalse(violations.isEmpty());
        }

        @Test
        void shouldSetAndGetPasswordIsNull() {
            loginRequest.setPassword(null);

            Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
            assertFalse(violations.isEmpty());
        }
    }
}
