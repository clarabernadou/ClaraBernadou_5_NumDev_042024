package com.openclassrooms.starterjwt.dto;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
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

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserDtoTests {

    private Validator validator;

    @Mock
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        userDto = new UserDto();
    }

    @Test
    void shouldSetAndGetId() {
        Long id = 1L;
        userDto.setId(id);
        assertEquals(id, userDto.getId());
    }

    @Nested
    class EmailTests {

        @Test
        void shouldSetAndGetEmail() {
            String email = "test@test.fr";
            userDto.setEmail(email);
            assertEquals(email, userDto.getEmail());
        }

        @Test
        void shouldNotAllowEmailLongerThan50Characters() {
            String email = "abcdefghijklmnopqrstuvabcdefghijklmnopqr@test.fr";
            userDto.setEmail(email);
            assertEquals(email, userDto.getEmail());
        }

        @Test
        void shouldNotAllowEmailAsEmpty() {
            String email = "";
            userDto.setEmail(email);
            assertEquals(email, userDto.getEmail());
        }

    }

    @Nested
    class LastNameTests {

        @Test
        void shouldSetAndGetLastName() {
            String lastName = "Toto";
            userDto.setLastName(lastName);
            assertEquals(lastName, userDto.getLastName());
        }

        @Test
        void shouldNotAllowLastNameLongerThan20Characters() {
            String lastName = "abcdefghijklmnopqrstuv";
            userDto.setLastName(lastName);
            assertEquals(lastName, userDto.getLastName());
        }

        @Test
        void shouldNotAllowLastNameAsEmpty() {
            String lastName = "";
            userDto.setLastName(lastName);
            assertEquals(lastName, userDto.getLastName());
        }
    }

    @Nested
    class FirstNameTests {

        @Test
        void shouldSetAndGetFirstName() {
            String firstName = "Toto";
            userDto.setFirstName(firstName);
            assertEquals(firstName, userDto.getFirstName());
        }

        @Test
        void shouldNotAllowFirstNameLongerThan20Characters() {
            String firstName = "abcdefghijklmnopqrstuv";
            userDto.setFirstName(firstName);
            assertEquals(firstName, userDto.getFirstName());
        }

        @Test
        void shouldNotAllowFirstNameAsEmpty() {
            String firstName = "";
            userDto.setFirstName(firstName);
            assertEquals(firstName, userDto.getFirstName());
        }
    }

    @Nested
    class AdminTests {

        @Test
        void shouldSetAndGetAdmin() {
            boolean admin = true;
            userDto.setAdmin(admin);
            assertEquals(admin, userDto.isAdmin());
        }

        @Test
        void shouldSetAdminToFalse() {
            boolean admin = false;
            userDto.setAdmin(admin);
            assertFalse(userDto.isAdmin());
        }
    }

    @Nested
    class PasswordTests {

            @Test
            void shouldSetAndGetPassword() {
                String password = "password";
                userDto.setPassword(password);
                assertEquals(password, userDto.getPassword());
            }

            @Test
            void shouldNotAllowPasswordLongerThan120Characters() {
                String password = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
                userDto.setPassword(password);
                assertEquals(password, userDto.getPassword());
            }

            @Test
            void shouldNotAllowPasswordAsEmpty() {
                String password = "";
                userDto.setPassword(password);
                assertEquals(password, userDto.getPassword());
            }
    }

    @Test
    void shouldSetAndGetCreatedAt() {
        userDto.setCreatedAt(null);
        assertNull(userDto.getCreatedAt());
    }

    @Test
    void shouldSetAndGetUpdatedAt() {
        userDto.setUpdatedAt(null);
        assertNull(userDto.getUpdatedAt());
    }
}
