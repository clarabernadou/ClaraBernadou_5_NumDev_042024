package com.openclassrooms.starterjwt.payload.response;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class MessageResponseTests {

    @Mock
    private MessageResponse messageResponse;

    private String message;


    @BeforeEach
    void setUp() {
        message = "This is a message";

        messageResponse = new MessageResponse(message);
    }

    @Test
    void shouldSetAndGetMessage() {
        messageResponse.setMessage(message);

        assertEquals(message, messageResponse.getMessage());
    }
}
