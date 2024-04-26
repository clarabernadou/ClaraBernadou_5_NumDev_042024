import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSessionInformation } from './session.fixtures';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return logged status', () => {
    service.$isLogged().subscribe(session => {
      expect(session).toBeTruthy();
    });
  });

  it('should return not logged status', () => {
    service.$isLogged().subscribe(
      session => fail('error expected'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );
  });

  it('should log in', () => {
    service.logIn(UserSessionInformation);
    service.$isLogged().subscribe(session => {
      expect(session).toBeTruthy();
    });
  });

  it('should not log in', () => {
    service.logIn(UserSessionInformation);
    service.$isLogged().subscribe(
      session => { 
        expect(session).toBeFalsy(); 
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );
  });

  it('should log out', () => {
    service.logOut();
    service.$isLogged().subscribe(session => {
      expect(session).toBeFalsy();
    });
  });

  it('should not log out', () => {
    service.logOut();
    service.$isLogged().subscribe(
      session => {
        expect(session).toBeTruthy();
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );
  });

  it('should next', () => {
    service.logIn(UserSessionInformation);
    service.$isLogged().subscribe(session => {
      expect(session).toBeTruthy();
    });
  });

  it('should not next', () => {
    service.logIn(UserSessionInformation);
    service.$isLogged().subscribe(
      session => {
        expect(session).toBeFalsy();
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );
  });
});