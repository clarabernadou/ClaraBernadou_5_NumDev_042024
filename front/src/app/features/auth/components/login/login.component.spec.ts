import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { FIX_LOGIN_USER_INFORMATIONS } from '../../services/auth.service.fixtures';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'login', component: LoginComponent }]),
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should submit with success', () => {
      const routerTestSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);

      component.form.setValue(FIX_LOGIN_USER_INFORMATIONS);
      component.submit();

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.body).toEqual(FIX_LOGIN_USER_INFORMATIONS);
      expect(req.request.method).toBe('POST');
      req.flush("Success");

      expect(routerTestSpy).toHaveBeenCalledWith(['/sessions']);
    });

    it('should handle login error', () => {
      const error = new Error('Login failed');
      const authServiceSpy = jest.spyOn(authService, 'login').mockReturnValue(new Observable(observer => observer.error(error)));

      component.form.setValue(FIX_LOGIN_USER_INFORMATIONS);
      component.submit();

      expect(authServiceSpy).toHaveBeenCalled();
      expect(component.onError).toBe(true);
    });
  });
});

