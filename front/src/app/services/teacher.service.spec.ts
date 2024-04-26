import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher, Teachers } from './teacher.fixtures';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', () => {
    service.all().subscribe();

    const req = httpMock.expectOne(`api/teacher`);
    expect(req.request.method).toBe('GET');
    req.flush(Teachers);
  });

  it('should not return all teachers', () => {
    service.all().subscribe();

    const req = httpMock.expectOne(`api/teacher`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', {status: 404, statusText: 'Not Found'});
  });

  it('should return a teacher', () => {
    service.detail('1').subscribe();

    const req = httpMock.expectOne(`api/teacher/1`);
    expect(req.request.method).toBe('GET');
    req.flush(Teachers);
  });

  it('should not return a teacher', () => {
    service.detail('null').subscribe();

    const req = httpMock.expectOne(`api/teacher/null`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', {status: 404, statusText: 'Not Found'});
  });
});
