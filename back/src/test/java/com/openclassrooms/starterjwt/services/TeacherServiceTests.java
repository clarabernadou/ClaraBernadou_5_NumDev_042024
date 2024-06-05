package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
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
public class TeacherServiceTests {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private final List<Teacher> teacherList = new ArrayList<>();

    Teacher mockTeacher = new Teacher();
    Long teacherId;

    @BeforeEach
    public void init() {
        teacherId = 999L;
        mockTeacher.setId(teacherId);

        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        Teacher teacher3 = new Teacher();
        teacher3.setId(3L);

        teacherList.add(teacher1);
        teacherList.add(teacher2);
        teacherList.add(teacher3);
    }

    @Test
    public void isFindAllCalledAndReturnAllTeachers() {
        when(teacherRepository.findAll()).thenReturn(teacherList);

        List<Teacher> teacherListResult = teacherService.findAll();

        assertEquals(teacherListResult.size(), teacherList.size());
        assertEquals(teacherListResult.get(0).getId(), teacherList.get(0).getId());

        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    public void isFindByIdCalledAndReturnTeacher() {
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(mockTeacher));

        Teacher teacherResult = teacherService.findById(teacherId);

        assertNotNull(teacherResult);
        assertEquals(teacherId, teacherResult.getId());

        verify(teacherRepository, times(1)).findById(teacherId);
    }
}