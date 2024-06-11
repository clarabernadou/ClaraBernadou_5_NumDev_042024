import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;
  let route: ActivatedRoute;
  let matSnackBar: MatSnackBar;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({}))
  };

  const mockSession: Session = {
    id: 1,
    name: 'name',
    date: new Date('2021-09-09'),
    teacher_id: 1,
    description: 'description',
    users: []
  };

  const mockMatSnackBar = {
    open: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: sessionApiService, useValue: mockSessionApiService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: MatSnackBarRef, useValue: {} },
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    sessionService = TestBed.inject(SessionService);
    route = TestBed.inject(ActivatedRoute);
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('ngOnInit', () => {
    it('should get session by id if url includes update ', () => {
      const routerSpy = jest.spyOn(router, 'url', 'get').mockReturnValue('sessions/update/1');
      const routeSpy = jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');

      component.ngOnInit();

      const sessionReq = httpMock.expectOne('api/session/1');
      expect(sessionReq.request.method).toBe('GET');
      sessionReq.flush([]);

      const teacherReq = httpMock.expectOne('api/teacher');
      expect(teacherReq.request.method).toBe('GET');
      teacherReq.flush([]);

      expect(routerSpy).toHaveBeenCalled();
      expect(routeSpy).toHaveBeenCalled();
      expect(component.onUpdate).toBe(true);
    });

    it('should get session by id if url not includes update ', () => {
      const routerSpy = jest.spyOn(router, 'url', 'get').mockReturnValue('sessions/1');

      component.ngOnInit();

      const teacherReq = httpMock.expectOne('api/teacher');
      expect(teacherReq.request.method).toBe('GET');
      teacherReq.flush([]);

      expect(routerSpy).toHaveBeenCalled();
      expect(component.onUpdate).toBe(false);
    });

    it('should redirect to /sessions if user is not admin', () => {
      const routerTestSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);

      sessionService.sessionInformation!.admin = false;
      component.ngOnInit();

      const req = httpMock.expectOne('api/teacher');
      expect(req.request.method).toBe('GET');
      req.flush([]);

      expect(routerTestSpy).toHaveBeenCalledWith(['/sessions']);
    });
  });

  describe('submit', () => {
    it('should create session if not onUpdate', () => {
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);
      const matSnackBarSpy = jest.spyOn(matSnackBar, 'open').mockImplementation();

      component.onUpdate = false;
      component.sessionForm?.patchValue(mockSession);
      component.submit();

      const sessionReq = httpMock.expectOne('api/session');
      expect(sessionReq.request.method).toBe('POST');
      sessionReq.flush([]);

      const teacherReq = httpMock.expectOne('api/teacher');
      expect(teacherReq.request.method).toBe('GET');
      teacherReq.flush([]);

      expect(matSnackBarSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });

    it('should update session if onUpdate', () => {
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);
      const matSnackBarSpy = jest.spyOn(matSnackBar, 'open').mockImplementation();

      (component as any).id = '1';
      component.onUpdate = true;
      component.sessionForm?.patchValue(mockSession);
      component.submit();

      const teacherReq = httpMock.expectOne('api/teacher');
      expect(teacherReq.request.method).toBe('GET');
      teacherReq.flush([]);

      const updateReq = httpMock.expectOne('api/session/1');
      expect(updateReq.request.method).toBe('PUT');
      updateReq.flush(mockSession);

      expect(matSnackBarSpy).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });
  });
});