import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let service: SessionService;
  let router: Router;
  let httpMock: HttpTestingController;
  let matSnackBar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [DetailComponent], 
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    })
      .compileComponents();
      service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('back', () => {
    it('should go back', () => {
      const historySpy = jest.spyOn(window.history, 'back');

      component.back();

      expect(historySpy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a session', () => {
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);
      const matSnackBarSpy = jest.spyOn(matSnackBar, 'open').mockImplementation();

      component.sessionId = '1';
      component.delete();

      const deleteReq = httpMock.expectOne('api/session/1');
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush([]);

      expect(matSnackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });
  });

  it('should participate in a session', () => {
    (component as any).fetchSession = jest.fn();
    component.sessionId = '1';
    component.userId = '1';
    component.participate();

    const participateReq = httpMock.expectOne('api/session/1/participate/1');
    expect(participateReq.request.method).toBe('POST');
    participateReq.flush({});

    expect((component as any).fetchSession).toHaveBeenCalled();
  });

  it('should unparticipate in a session', () => {
    (component as any).fetchSession = jest.fn();
    component.sessionId = '1';
    component.userId = '1';
    component.unParticipate();

    const unParticipateReq = httpMock.expectOne('api/session/1/participate/1');
    expect(unParticipateReq.request.method).toBe('DELETE');
    unParticipateReq.flush({});

    expect((component as any).fetchSession).toHaveBeenCalled();
  });
});

