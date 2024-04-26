import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User, Users } from './user.fixtures';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    service.getById('1').subscribe(user => {
      expect(user).toEqual(Users[0]);
    });

    const req = httpMock.expectOne(`api/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(Users[0]);
  });

  it('should not get a user by id', () => {
    service.getById('null').subscribe(
      user => fail('error expected'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );

    const req = httpMock.expectOne(`api/user/null`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', {status: 404, statusText: 'Not Found'});
  });

  it('should delete a user', () => {
    service.delete('1').subscribe(user => {
      expect(user).toEqual(null);
    });

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should not delete a user', () => {
    service.delete('null').subscribe(
      user => fail('error expected'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );

    const req = httpMock.expectOne('api/user/null');
    expect(req.request.method).toBe('DELETE');
    req.flush('Error', {status: 404, statusText: 'Not Found'});
  });
});