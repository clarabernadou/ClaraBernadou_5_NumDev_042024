package com.openclassrooms.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    User mockUser = new User();
    Long userId;

    @BeforeEach
    public void init() {
        userId = 999L;
        mockUser.setId(userId);
    }

    @Test
    public void isDeleteCalled() {
        userService.delete(userId);

        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    public void isFindByIdCalledAndReturnUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        User userResult = userService.findById(userId);

        assertNotNull(userResult);
        assertEquals(userId, userResult.getId());

        verify(userRepository, times(1)).findById(userId);
    }
}
