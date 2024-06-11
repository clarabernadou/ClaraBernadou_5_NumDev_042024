package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import org.junit.jupiter.api.Assertions;

import java.time.LocalDateTime;

import static org.junit.platform.engine.TestTag.isValid;

@ExtendWith(MockitoExtension.class)
public class TeacherTests {

    @Nested
    class lastNameTests {
        @Test
        public void lastNameIsBlank() {
            Teacher teacher = new Teacher();
            teacher.setLastName("");

            boolean validationResult = isValid(teacher.getLastName());

            Assertions.assertFalse(validationResult);
        }

        @Test
        public void lastNameNotBlank() {
            Teacher teacher = new Teacher();
            teacher.setLastName("Toto");

            boolean validationResult = isValid(teacher.getLastName());

            Assertions.assertTrue(validationResult);
        }
    }

    @Nested
    class firstNameTests {
        @Test
        public void firstNameIsBlank() {
            Teacher teacher = new Teacher();
            teacher.setFirstName("");

            boolean validationResult = isValid(teacher.getFirstName());

            Assertions.assertFalse(validationResult);
        }

        @Test
        public void firstNameNotBlank() {
            Teacher teacher = new Teacher();
            teacher.setFirstName("Toto");

            boolean validationResult = isValid(teacher.getFirstName());

            Assertions.assertTrue(validationResult);
        }
    }

    @Test
    public void createdAtIsNotNull() {
        Teacher teacher = new Teacher();
        teacher.setCreatedAt(LocalDateTime.now());

        boolean validationResult = isValid(String.valueOf(teacher.getCreatedAt()));

        Assertions.assertTrue(validationResult);
    }

    @Test
    public void updatedAtIsNotNull() {
        Teacher teacher = new Teacher();
        teacher.setUpdatedAt(LocalDateTime.now());

        boolean validationResult = isValid(String.valueOf(teacher.getUpdatedAt()));

        Assertions.assertTrue(validationResult);
    }

    @Test
    public void idIsNotNull() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        boolean validationResult = isValid(String.valueOf(teacher.getId()));

        Assertions.assertTrue(validationResult);
    }
}
