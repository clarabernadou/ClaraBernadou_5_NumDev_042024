import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterRequest } from './register.component.fixtures';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'register', component: RegisterComponent }]),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
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

      component.form.setValue(RegisterRequest);
      component.submit();

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.body).toEqual(RegisterRequest);
      expect(req.request.method).toBe('POST');
      req.flush("Success");

      expect(routerTestSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should handle register error', () => {
      const error = new Error('Register failed');
      const authServiceSpy = jest.spyOn(authService, 'register').mockReturnValue(new Observable(observer => observer.error(error)));

      component.form.setValue(RegisterRequest);
      component.submit();

      expect(authServiceSpy).toHaveBeenCalled();
      expect(component.onError).toBe(true);
    });
  });
});