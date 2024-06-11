package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.platform.engine.TestTag.isValid;

@ExtendWith(MockitoExtension.class)
public class UserTests {

    @Nested
    class email {
        @Test
        public void emailNonNull() {
            User user = new User();
            user.setEmail("test@test.fr");

            boolean validationResult = isValid(user.getEmail());

            assertTrue(validationResult);
        }

        @Test
        void emailShouldBeLessThan50() {
            User user = new User();
            user.setEmail("test@test.fr");

            assertTrue(user.getEmail().length() <= 50);
        }

        @Test
        void emailShouldBeMoreThan50() {
            User user = new User();
            user.setEmail("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz@example.fr");

            assertFalse(user.getEmail().length() <= 50);
        }
    }

    @Nested
    class lastname {
        @Test
        public void lastnameNonNull() {
            User user = new User();
            user.setLastName("Toto");

            boolean validationResult = isValid(user.getLastName());

            assertTrue(validationResult);
        }

        @Test
        void lastNameShouldBeLessThan20() {
            User user = new User();
            user.setLastName("Toto");
            assertTrue(user.getLastName().length() <= 20);
        }

        @Test
        void lastNameShouldNotBeMoreThan20() {
            User user = new User();
            user.setLastName("abcdefghijklmnopqrstuv");
            assertFalse(user.getLastName().length() <= 20);
        }
    }

    @Nested
    class firstname {
        @Test
        public void firstnameNonNull() {
            User user = new User();
            user.setFirstName("Toto");

            boolean validationResult = isValid(user.getFirstName());

            assertTrue(validationResult);
        }

        @Test
        void firstNameShouldBeLessThan20() {
            User user = new User();
            user.setFirstName("Toto");
            assertTrue(user.getFirstName().length() <= 20);
        }

        @Test
        void firstNameShouldNotBeMoreThan20() {
            User user = new User();
            user.setFirstName("abcdefghijklmnopqrstuv");
            assertFalse(user.getFirstName().length() <= 20);
        }
    }

    @Nested
    class password {
        @Test
        public void passwordNonNull() {
            User user = new User();
            user.setPassword("Toto");

            boolean validationResult = isValid(user.getPassword());

            assertTrue(validationResult);
        }

        @Test
        void passwordShouldBeLessThan120() {
            User user = new User();
            user.setPassword("Password");
            assertTrue(user.getPassword().length() <= 120);
        }

        @Test
        void passwordShouldNotBeMoreThan120() {
            User user = new User();
            user.setPassword("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz");
            assertFalse(user.getPassword().length() <= 120);
        }
    }

    @Test
    public void adminNotNull() {
        User user = new User();
        user.setAdmin(true);

        boolean validationResult = isValid(String.valueOf(user.isAdmin()));

        assertTrue(validationResult);
    }
}
