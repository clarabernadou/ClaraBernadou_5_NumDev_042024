package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerIntTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private TeacherRepository teacherRepository;

    private static Teacher teacher;

    private final Long id = 1L;

    @BeforeAll
    public static void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Toto");
        teacher.setLastName("Toto");
    }

    @Nested
    class findById {

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnTeacherDetailsWhenTeacherExist() throws Exception {
            when(teacherRepository.findById(id)).thenReturn(java.util.Optional.of(teacher));

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1L))
                    .andExpect(jsonPath("$.firstName").value("Toto"))
                    .andExpect(jsonPath("$.lastName").value("Toto"));

            verify(teacherRepository, times(1)).findById(id);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnErrorWhenEmptyTeacher() throws Exception {
            when(teacherRepository.findById(id)).thenReturn(java.util.Optional.empty());

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

            verify(teacherRepository, times(1)).findById(id);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnBadRequestErrorWhenInvalidId() throws Exception {
            when(teacherRepository.findAll()).thenReturn(java.util.List.of(teacher));

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/invalid-id")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(teacherRepository, times(0)).findById(id);
        }
    }

    @Test
    @WithMockUser(username = "test@test.fr", roles = {"USER"})
    public void shouldReturnAllTeachersWhenTeacherExist() throws Exception {
        when(teacherRepository.findAll()).thenReturn(java.util.List.of(teacher));

        String jwtToken = "jwtToken";

        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].firstName").value("Toto"))
                .andExpect(jsonPath("$[0].lastName").value("Toto"));

        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    @WithMockUser(username = "test@test.fr", roles = {"USER"})
    public void shouldReturnEmptyListWhenNotTeacher() throws Exception {
        when(teacherRepository.findAll()).thenReturn(java.util.List.of());

        String jwtToken = "jwtToken";

        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        verify(teacherRepository, times(1)).findAll();
    }
}
