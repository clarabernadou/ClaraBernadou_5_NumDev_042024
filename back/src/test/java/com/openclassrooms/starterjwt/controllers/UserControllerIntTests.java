package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private UserRepository userRepository;

    private User user;

    private final Long id = 1L;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        user = new User();
        user.setId(1L);
        user.setEmail("test@test.fr");
        user.setFirstName("Toto");
        user.setLastName("Toto");
    }

    @Nested
    class findById {
        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnUserDetailsWhenUserExists() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.of(user));

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/user/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("test@test.fr")))
                    .andExpect(content().string(containsString("Toto")))
                    .andExpect(content().string(containsString("Toto")))
                    .andExpect(jsonPath("$.id").value(1L));

            verify(userRepository, times(1)).findById(id);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnNotFoundErrorWhenEmptyUser() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.empty());

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.get("/api/user/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

            verify(userRepository, times(1)).findById(id);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnBadRequestErrorWhenInvalidId() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.of(user));

            mockMvc.perform(MockMvcRequestBuilders.get("/api/user/invalid-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(userRepository, times(0)).findById(id);
        }
    }

    @Nested
    class save {
        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnDeleteUserWhenUserExist() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.of(user));

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(userRepository, times(0)).delete(user);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnNotFoundErrorWhenEmptyUser() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.empty());

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/" + id)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

            verify(userRepository, times(0)).delete(user);
        }

        @Test
        @WithMockUser(username = "test@test.fr", roles = {"USER"})
        public void shouldReturnBadRequestErrorWhenInvalidId() throws Exception {
            when(userRepository.findById(id)).thenReturn(Optional.of(user));

            String jwtToken = "jwtToken";

            mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/invalid-id")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verify(userRepository, times(0)).delete(user);
        }
    }
}
