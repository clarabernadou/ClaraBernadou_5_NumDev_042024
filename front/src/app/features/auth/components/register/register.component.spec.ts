import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../services/auth.service.fixtures';
import { EmptyRegisterRequest } from './register.component.fixtures';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: AuthService;

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
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit with success', () => {
    const registerRequest = RegisterRequest;
    component.form.setValue(registerRequest);
    component.submit();

    expect(component.form.get('email')?.value).toEqual(registerRequest.email);
    expect(component.form.get('firstName')?.value).toEqual(registerRequest.firstName);
    expect(component.form.get('lastName')?.value).toEqual(registerRequest.lastName);
    expect(component.form.get('password')?.value).toEqual(registerRequest.password);
    expect(component.onError).toBeFalsy();
  });

  it('should handle register error', () => {
    const resigterRequest = RegisterRequest;
    const error = new Error('Register failed');
    jest.spyOn(authService, 'register').mockReturnValue(throwError(error));

    component.form.setValue(resigterRequest);
    component.submit();

    expect(component.onError).toBeTruthy();
  });
});