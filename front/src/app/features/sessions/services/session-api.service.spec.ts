import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { FIX_USER_SESSION_INFORMATION, FIX_USER_SESSION_INFORMATION_ARR } from 'src/app/services/session.fixtures';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FIX_SESSION_API_INFORMATIONS } from './session-api.fixture';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all sessions', () => {
    service.all().subscribe(sessions => {
      expect(sessions).toBeTruthy();
      expect(sessions).toEqual(FIX_USER_SESSION_INFORMATION_ARR)
    });

    const req = httpMock.expectOne(`api/session`);
    expect(req.request.method).toBe('GET');
    req.flush(FIX_USER_SESSION_INFORMATION_ARR);
  });

  describe('detail', () => {
    it('should return session detail', () => {
      service.detail('1').subscribe(session => {
        expect(session).toBeTruthy();
        expect(session).toEqual(FIX_USER_SESSION_INFORMATION);
      });

      const req = httpMock.expectOne(`api/session/1`);
      expect(req.request.method).toBe('GET');
      req.flush(FIX_USER_SESSION_INFORMATION)
    });

    it('should not return session detail because invalid id', () => {
      service.detail('invalid-id').subscribe(session => {
        expect(session).toBeFalsy();
        expect(session).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/invalid-id`);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });
  });

  describe('delete', () => {
    it('should delete session', () => {
      service.delete('1').subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should not delete session because invalid id', () => {
      service.delete('invalid-id').subscribe(response => {
        expect(response).toBeFalsy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/invalid-id`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });
  });

  it('should create session', () => {
    service.create(FIX_SESSION_API_INFORMATIONS).subscribe(session => {
      expect(session).toBeTruthy();
      expect(session).toEqual(FIX_SESSION_API_INFORMATIONS);
    });

    const req = httpMock.expectOne(`api/session`);
    expect(req.request.method).toBe('POST');
    req.flush(FIX_SESSION_API_INFORMATIONS);
  });

  describe('updated', () => {
    it('should update session', () => {
      service.update('1', FIX_SESSION_API_INFORMATIONS).subscribe(session => {
        expect(session).toBeTruthy();
        expect(session).toEqual(FIX_SESSION_API_INFORMATIONS);
      });

      const req = httpMock.expectOne(`api/session/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(FIX_SESSION_API_INFORMATIONS);
    });

    it('should not update session because invalid id', () => {
      service.update('invalid-id', FIX_SESSION_API_INFORMATIONS).subscribe(session => {
        expect(session).toBeFalsy();
        expect(session).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/invalid-id`);
      expect(req.request.method).toBe('PUT');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });
  });

  describe('participate', () => {
    it('should participate to session', () => {
      service.participate('1', '1').subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/1/participate/1`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should not participate to session because invalid session id', () => {
      service.participate('invalid-id', '1').subscribe(response => {
        expect(response).toBeFalsy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/invalid-id/participate/1`);
      expect(req.request.method).toBe('POST');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });

    it('should not participate to session because invalid user id', () => {
      service.participate('1', 'invalid-id').subscribe(response => {
        expect(response).toBeFalsy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/1/participate/invalid-id`);
      expect(req.request.method).toBe('POST');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });
  });

  describe('unParticipate', () => {
    it('should unParticipate to session', () => {
      service.unParticipate('1', '1').subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/1/participate/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should not unParticipate to session because invalid session id', () => {
      service.unParticipate('invalid-id', '1').subscribe(response => {
        expect(response).toBeFalsy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/invalid-id/participate/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });

    it('should not unParticipate to session because invalid user id', () => {
      service.unParticipate('1', 'invalid-id').subscribe(response => {
        expect(response).toBeFalsy();
        expect(response).toEqual(null);
      });

      const req = httpMock.expectOne(`api/session/1/participate/invalid-id`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Error', { status: 404, statusText: 'Not Found' })
    });
  });
});
