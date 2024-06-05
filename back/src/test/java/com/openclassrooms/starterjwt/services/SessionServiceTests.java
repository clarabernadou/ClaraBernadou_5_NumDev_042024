package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class SessionServiceTests {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    Session mockSession = new Session();
    Long sessionId;
    List<Session> sessionList = new ArrayList<>();

    User mockUser = new User();
    Long userId;

    @BeforeEach
    public void init() {
        sessionId = 999L;
        mockSession.setId(sessionId);

        userId = 888L;
        mockUser.setId(userId);

        Session session1 = new Session();
        session1.setId(1L);
        Session session2 = new Session();
        session2.setId(2L);
        Session session3 = new Session();
        session3.setId(3L);

        sessionList.add(session1);
        sessionList.add(session2);
        sessionList.add(session3);
    }

    @Test
    public void isCreateCalledAndReturnSession() {
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        Session sessionResult = sessionService.create(mockSession);

        assertNotNull(sessionResult);
        assertEquals(sessionId, sessionResult.getId());

        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    public void isDeleteCalled() {
        sessionService.delete(sessionId);

        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    public void isFindAllCalledAndReturnAllSessions() {
        when(sessionRepository.findAll()).thenReturn(sessionList);

        List<Session> sessionListResult = sessionService.findAll();

        assertEquals(sessionListResult.size(), sessionList.size());
        assertEquals(sessionListResult.get(0).getId(), sessionList.get(0).getId());

        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    public void isFindByIdCalledAndReturnSession() {
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        Session sessionResult = sessionService.getById(sessionId);

        assertNotNull(sessionResult);
        assertEquals(sessionId, sessionResult.getId());

        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    public void isUpdateCalledAndReturnSession() {
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        Session sessionResult = sessionService.update(sessionId, mockSession);

        assertNotNull(sessionResult);
        assertEquals(sessionId, sessionResult.getId());

        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Nested
    class ParticipateTests {

        @Test
        public void isParticipateCalledWithSuccess() {
            mockSession.setUsers(new ArrayList<>());

            when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));
            when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

            assertNotNull(mockSession);
            assertNotNull(mockUser);

            sessionService.participate(sessionId, userId);

            boolean alreadyParticipate = mockSession.getUsers().stream().anyMatch(o -> o.getId().equals(userId));
            assertTrue(alreadyParticipate);

            verify(sessionRepository, times(1)).findById(sessionId);
            verify(userRepository, times(1)).findById(userId);
            verify(sessionRepository, times(1)).save(mockSession);
        }

        @Test
        public void isParticipateCalledWithSessionNotFound() {
            when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
            when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

            assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        }

        @Test
        public void isParticipateCalledWithUserNotFound() {
            when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        }

        @Test
        public void isParticipateCalledWithSessionAndUserNotFound() {
            when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        }

        @Test
        public void isParticipateCalledWithUserAlreadyParticipate() {
            mockSession.setUsers(new ArrayList<>());
            mockSession.getUsers().add(mockUser);

            when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));
            when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

            assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
        }
    }

    @Nested
    class NoLongerParticipateTests {

        @Test
        public void isNoLongerParticipateCalledWithSuccess() {
            mockSession.setUsers(new ArrayList<>());
            mockSession.getUsers().add(mockUser);

            when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

            assertNotNull(mockSession);

            sessionService.noLongerParticipate(sessionId, userId);

            boolean alreadyParticipate = mockSession.getUsers().stream().anyMatch(o -> o.getId().equals(userId));
            assertFalse(alreadyParticipate);

            verify(sessionRepository, times(1)).findById(sessionId);
            verify(sessionRepository, times(1)).save(mockSession);
        }

        @Test
        public void isNoLongerParticipateCalledWithSessionNotFound() {
            when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        }

        @Test
        public void isNoLongerParticipateCalledWithUserNotParticipate() {
            mockSession.setUsers(new ArrayList<>());

            when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

            assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        }
    }
}
