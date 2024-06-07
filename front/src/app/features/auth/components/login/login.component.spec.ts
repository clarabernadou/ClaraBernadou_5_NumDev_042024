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
import { LoginRequest } from '../../services/auth.service.fixtures';
import { UserSessionInformation } from 'src/app/services/session.fixtures';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/services/user.fixtures';
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let sessionService: SessionService;
  let authService: AuthService;

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
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(('submit'), () => {
    it('should submit with success', () => {
      const loginRequest = LoginRequest;;

      component.form.setValue(loginRequest);
      component.submit();

      expect(component.form.get('email')?.value).toEqual(loginRequest.email);
      expect(component.form.get('password')?.value).toEqual(loginRequest.password);
    });

    it('should handle login error', () => {
      const loginRequest = LoginRequest;
      const error = new Error('Login failed');
      
      jest.spyOn(authService, 'login').mockReturnValue(throwError(error));

      component.form.setValue(loginRequest);
      component.submit();

      expect(component.onError).toBeTruthy();
    });
  });
});

