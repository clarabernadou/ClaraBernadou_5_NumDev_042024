package com.openclassrooms.starterjwt.dto;

import com.openclassrooms.starterjwt.dto.SessionDto;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@ExtendWith(MockitoExtension.class)
public class SessionDtoTests {

    private Validator validator;

    @Mock
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        sessionDto = new SessionDto();
    }

    @Test
    void shouldSetAndGetId() {
        Long id = 1L;
        sessionDto.setId(id);
        assertEquals(id, sessionDto.getId());
    }

    @Nested
    class NameTests {

        @Test
        void shouldSetAndGetName() {
            String name = "test";
            sessionDto.setName(name);
            assertEquals(name, sessionDto.getName());
        }

        @Test
        void shouldNotAllowNameLongerThan50Characters() {
            String name = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
            sessionDto.setName(name);
            assertEquals(name, sessionDto.getName());
        }

        @Test
        void shouldNotAllowNullName() {
            sessionDto.setName(null);
            Set<ConstraintViolation<SessionDto>> violations = validator.validate(sessionDto);
            assertFalse(violations.isEmpty());
        }
    }

    @Test
    void shouldSetAndGetDate() {
        Date date = new Date();
        sessionDto.setDate(date);
        assertEquals(date, sessionDto.getDate());
    }

    @Test
    void shouldSetAndGetTeacherId() {
        Long teacher_id = 1L;
        sessionDto.setTeacher_id(teacher_id);
        assertEquals(teacher_id, sessionDto.getTeacher_id());
    }

    @Nested
    class Description {

        @Test
        void shouldSetAndGetDescription() {
            String description = "test";
            sessionDto.setDescription(description);
            assertEquals(description, sessionDto.getDescription());
        }

        @Test
        void shouldNotAllowDescriptionLongerThan2500Characters() {
            String description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget faucibus eros. Quisque venenatis maximus odio, id vestibulum justo varius vitae. Maecenas maximus commodo lacus, ac porta mi tincidunt eget. Duis gravida tincidunt eleifend. Maecenas eu volutpat erat, eget sodales sapien. Nunc consectetur leo tellus. Ut vitae massa feugiat, cursus felis ac, convallis lorem. Curabitur diam libero, porta et dictum ut, suscipit at libero. Nam non accumsan elit. Pellentesque mattis, nulla ut porttitor dictum, est ipsum faucibus nisi, ac lacinia erat urna id quam. Aenean lacus lorem, semper vel augue in, sagittis fermentum arcu. Sed nec faucibus libero. In hac habitasse platea dictumst. Nulla iaculis sodales urna vitae semper. Praesent non tellus dignissim purus consequat efficitur. Quisque tristique in odio vel ultricies. Etiam quis mi enim. Morbi et orci vel risus consequat ultricies. Morbi nec justo sit amet elit eleifend cursus. Nulla ac elit ac enim lobortis suscipit tristique vel erat. Suspendisse accumsan diam nisl, vel semper lacus mollis lacinia. Ut viverra aliquet mi, sit amet tempus orci convallis vel. Suspendisse turpis purus, laoreet eget eros in, ornare tempus ex. Donec velit est, rutrum a turpis ac, vehicula pharetra sapien. Aliquam imperdiet vulputate mollis. Etiam ut luctus ex, id convallis velit. Aenean lacinia dictum nunc, pretium rhoncus mi mattis a. Suspendisse quis urna ornare, elementum neque ut, iaculis turpis. Maecenas quis purus gravida, iaculis metus in, iaculis ligula. Aliquam non ligula nisl. In ut leo ligula. In hac habitasse platea dictumst. Integer vel porttitor diam. Fusce massa nisl, scelerisque et justo ac, bibendum dictum lacus. Sed orci mi, convallis ut orci et, faucibus malesuada lorem. Integer elementum fermentum ex, molestie accumsan dui pharetra nec. Morbi id vestibulum purus, id posuere tellus. Pellentesque sed leo at quam efficitur iaculis. Nam vestibulum eleifend leo ut elementum. Duis euismod sem erat, sit amet hendrerit ligula iaculis at. Cras interdum odio sed suscipit rutrum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam iaculis scelerisque lectus, ut laoreet ex. Fusce vel pulvinar lectus. Nam eu tristique augue. Integer nec aliquet nunc, a viverra ipsum. Suspendisse a ultricies lorem. Fusce at velit laoreet, convallis enim commodo, dignissim est. Etiam eget faucibus justo. Duis porta tincidunt efficitur. Proin in elit laoreet, luctus augue eu, vestibulum nisl. Ut sagittis, felis rutrum feugiat aliquam.";
            sessionDto.setDescription(description);
            assertEquals(description, sessionDto.getDescription());
        }

        @Test
        void shouldAllowEmptyDescription() {
            sessionDto.setDescription(null);
            Set<ConstraintViolation<SessionDto>> violations = validator.validate(sessionDto);
            assertFalse(violations.isEmpty());
        }
    }

    @Test
    void shouldSetAndGetUsers() {
        List<Long> users = new ArrayList<>();
        users.add(1L);
        sessionDto.setUsers(users);
        assertEquals(users, sessionDto.getUsers());
    }

    @Test
    void shouldSetAndGetCreatedAt() {
        LocalDateTime createdAt = LocalDateTime.now();
        sessionDto.setCreatedAt(createdAt);
        assertEquals(createdAt, sessionDto.getCreatedAt());
    }

    @Test
    void shouldSetAndGetUpdatedAt() {
        LocalDateTime updatedAt = LocalDateTime.now();
        sessionDto.setUpdatedAt(updatedAt);
        assertEquals(updatedAt, sessionDto.getUpdatedAt());
    }
}
