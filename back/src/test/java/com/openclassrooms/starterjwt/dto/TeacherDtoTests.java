package com.openclassrooms.starterjwt.dto;

import com.openclassrooms.starterjwt.dto.TeacherDto;
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
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TeacherDtoTests {

    private Validator validator;

    @Mock
    private TeacherDto teacherDto;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        teacherDto = new TeacherDto();
    }

    @Test
    void shouldSetAndGetId() {
        Long id = 1L;
        teacherDto.setId(id);
        assertEquals(id, teacherDto.getId());
    }

    @Nested
    class LastNameTests {

        @Test
        void shouldSetAndGetLastName() {
            String lastName = "Toto";
            teacherDto.setLastName(lastName);
            assertEquals(lastName, teacherDto.getLastName());
        }

        @Test
        void shouldNotAllowLastNameLongerThan20Characters() {
            String lastName = "abcdefghijklmnopqrstuv";
            teacherDto.setLastName(lastName);
            assertEquals(lastName, teacherDto.getLastName());
        }

        @Test
        void shouldNotAllowLastNameAsEmpty() {
            teacherDto.setLastName(null);
            Set<ConstraintViolation<TeacherDto>> violations = validator.validate(teacherDto);
            assertFalse(violations.isEmpty());
        }
    }

    @Nested
    class FirstNameTests {

        @Test
        void shouldSetAndGetFirstName() {
            String firstName = "Toto";
            teacherDto.setFirstName(firstName);
            assertEquals(firstName, teacherDto.getFirstName());
        }

        @Test
        void shouldNotAllowFirstNameLongerThan20Characters() {
            String firstName = "abcdefghijklmnopqrstuv";
            teacherDto.setFirstName(firstName);
            assertEquals(firstName, teacherDto.getFirstName());
        }

        @Test
        void shouldNotAllowFirstNameAsEmpty() {
            teacherDto.setFirstName(null);
            Set<ConstraintViolation<TeacherDto>> violations = validator.validate(teacherDto);
            assertFalse(violations.isEmpty());
        }
    }

    @Test
    void shouldSetAndGetCreatedAt() {
        LocalDateTime now = LocalDateTime.now();
        teacherDto.setCreatedAt(now);
        assertEquals(now, teacherDto.getCreatedAt());
    }

    @Test
    void shouldSetAndGetUpdatedAt() {
        LocalDateTime now = LocalDateTime.now();
        teacherDto.setUpdatedAt(now);
        assertEquals(now, teacherDto.getUpdatedAt());
    }
}