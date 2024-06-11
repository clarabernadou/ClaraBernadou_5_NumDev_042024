package com.openclassrooms.starterjwt.controllers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIntTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    private static Session session;

    private static SessionDto sessionDto;

    private Long id = 1L;

    private static Teacher teacher;

    @BeforeAll
    public static void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);

        session = new Session();
        session.setId(1L);
        session.setName("Test Session");
        session.setDescription("Test Description");
        session.setUsers(null);
        session.setTeacher(teacher);

        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Test Session");
        sessionDto.setDescription("Test Description");
        sessionDto.setUsers(null);
        sessionDto.setTeacher_id(1L);

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = formatter.parse("2021-12-12T12:00:00");

            session.setDate(date);
            sessionDto.setDate(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }


    @Nested
    class findById {

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnSessionDetailsWhenSessionExists() throws Exception {
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(sessionDto.getId()))
                    .andExpect(jsonPath("$.name").value(sessionDto.getName()));
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnNotFoundErrorWhenEmptyUser() throws Exception {
            when(sessionService.getById(1L)).thenReturn(null);

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnBadRequestErrorWhenInvalidId() throws Exception {
            when(sessionService.getById(1L)).thenReturn(session);

            mockMvc.perform(MockMvcRequestBuilders.get("/api/session/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class findAll {
        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnAllSessionsWhenSessionsExist() throws Exception {
            when(sessionService.findAll()).thenReturn(java.util.List.of(session));
            when(sessionMapper.toDto(java.util.List.of(session))).thenReturn(java.util.List.of(sessionDto));

            mockMvc.perform(MockMvcRequestBuilders.get("/api/session")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1L))
                    .andExpect(jsonPath("$[0].name").value("Test Session"));

            verify(sessionService, Mockito.times(1)).findAll();
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnEmptyListWhenNoSession() throws Exception {
            when(sessionService.findAll()).thenReturn(java.util.List.of());
            when(sessionMapper.toDto(java.util.List.of())).thenReturn(java.util.List.of());

            mockMvc.perform(MockMvcRequestBuilders.get("/api/session")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isEmpty());

            verify(sessionService, Mockito.times(1)).findAll();
        }
    }

    @Test
    @WithMockUser(username = "test@test.fr", roles = {"USER"})
    public void shouldCreateSessionWhenSessionIsValid() throws Exception {
        when(sessionService.create(Mockito.any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"id\": 1," +
                                " \"name\": \"Test Session\"," +
                                " \"date\": \"2021-12-12T12:00:00\"," +
                                " \"teacher_id\": 1," +
                                " \"users\": []," +
                                " \"description\": \"Test Description\" }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Test Session"))
                .andExpect(jsonPath("$.date").value("2021-12-12T12:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1L))
                .andExpect(jsonPath("$.users").isEmpty())
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Nested
    class update {
        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldUpdatedSessionWhenSessionIsUpdated() throws Exception {
            SessionDto updatedSessionDto = new SessionDto();
            updatedSessionDto.setId(sessionDto.getId());
            updatedSessionDto.setName("Test Session Updated");
            updatedSessionDto.setDescription("Test Description Updated");
            updatedSessionDto.setDate(sessionDto.getDate());
            updatedSessionDto.setTeacher_id(1L);
            updatedSessionDto.setUsers(null);

            when(sessionService.update(1L, session)).thenReturn(session);
            when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
            when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(updatedSessionDto);

            mockMvc.perform(MockMvcRequestBuilders.put("/api/session/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ \"id\": 1," +
                                    " \"name\": \"Test Session Updated\"," +
                                    " \"date\": \"2021-12-12T12:00:00\"," +
                                    " \"teacher_id\": 1," +
                                    " \"users\": []," +
                                    " \"description\": \"Test Description Updated\" }"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1L))
                    .andExpect(jsonPath("$.name").value("Test Session Updated"))
                    .andExpect(jsonPath("$.date").value("2021-12-12T12:00:00.000+00:00"))
                    .andExpect(jsonPath("$.teacher_id").value(1L))
                    .andExpect(jsonPath("$.users").isEmpty())
                    .andExpect(jsonPath("$.description").value("Test Description Updated"));

            verify(sessionService, Mockito.times(1)).update(1L, session);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotUpdateSessionWhenEmptyModifications() throws Exception {
            when(sessionService.update(1L, session)).thenReturn(session);

            mockMvc.perform(MockMvcRequestBuilders.put("/api/session/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ \"id\": 1," +
                                    " \"name\": \"Test Session\"," +
                                    " \"date\": \"2021-12-12T12:00:00\"," +
                                    " \"teacher_id\": 1," +
                                    " \"users\": []," +
                                    " \"description\": \"Test Description\" }"))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(0)).update(1L, session);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotUpdateSessionWhenInvalidId() throws Exception {
            when(sessionService.update(1L, session)).thenReturn(session);

            mockMvc.perform(MockMvcRequestBuilders.put("/api/session/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ \"id\": 1," +
                                    " \"name\": \"Test Session Updated\"," +
                                    " \"date\": \"2021-12-12T12:00:00\"," +
                                    " \"teacher_id\": 1," +
                                    " \"users\": []," +
                                    " \"description\": \"Test Description Updated\" }"))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).update(1L, session);
        }
    }

    @Nested
    class save {

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldDeleteSessionWhenSessionExists() throws Exception {
            when(sessionService.getById(1L)).thenReturn(session);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + id)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(1)).delete(1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotDeleteSessionWhenEmptySession() throws Exception {
            when(sessionService.getById(1L)).thenReturn(null);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + id)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

            verify(sessionService, Mockito.times(0)).delete(1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotDeleteSessionWhenInvalidId() throws Exception {
            when(sessionService.getById(1L)).thenReturn(session);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).delete(1L);
        }
    }

    // TODO: Continuer de modifier / d'ajouter des tests pour les autres méthodes du controller
    //  (participate(), noLongerParticipate)

    @Nested
    class participate {

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldParticipateToSessionWhenUserIsAdded() throws Exception {
            doNothing().when(sessionService).participate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + sessionDto.getId() + "/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(1)).participate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldParticipateToSessionWhenUserIsAlreadyAdded() throws Exception {
            sessionDto.setUsers(java.util.List.of(1L));

            doNothing().when(sessionService).participate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + sessionDto.getId() + "/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(1)).participate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotParticipateToSessionWhenInvalidSessionId() throws Exception {
            doNothing().when(sessionService).participate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/session/invalid-id/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).participate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotParticipateToSessionWhenInvalidUserId() throws Exception {
            doNothing().when(sessionService).participate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + sessionDto.getId() + "/participate/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).participate(1L, 1L);
        }
    }

    @Nested
    class noLongerParticipate {

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNoLongerParticipateToSessionWhenUserIsRemoved() throws Exception {
            sessionDto.setUsers(java.util.List.of(1L));

            doNothing().when(sessionService).noLongerParticipate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + sessionDto.getId() + "/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(1)).noLongerParticipate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotNoLongerParticipateToSessionWhenUserIsNotAdded() throws Exception {
            doNothing().when(sessionService).noLongerParticipate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + sessionDto.getId() + "/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(sessionService, Mockito.times(1)).noLongerParticipate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotNoLongerParticipateToSessionWhenInvalidSessionId() throws Exception {
            doNothing().when(sessionService).noLongerParticipate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/invalid-id/participate/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).noLongerParticipate(1L, 1L);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldNotNoLongerParticipateToSessionWhenInvalidUserId() throws Exception {
            doNothing().when(sessionService).noLongerParticipate(sessionDto.getId(), 1L);
            when(sessionService.getById(1L)).thenReturn(session);
            when(sessionMapper.toDto(session)).thenReturn(sessionDto);

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + sessionDto.getId() + "/participate/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(sessionService, Mockito.times(0)).noLongerParticipate(1L, 1L);
        }
    }
}
