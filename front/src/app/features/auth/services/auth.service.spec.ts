import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoginRequest, LoginRequestWithBadEmail, LoginRequestWithBadPassword, RegisterRequest, RegisterRequestWithInvalidEmail } from "./auth.service.fixtures";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Observable, observable, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule],
            providers: [AuthService],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {
        it('should register with success', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.register(RegisterRequest).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(RegisterRequest);
            req.flush('Success');

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', RegisterRequest);
        });

        it('should try to register with an already registered email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.register(RegisterRequest).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 409, statusText: 'Conflict' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', RegisterRequest);
        });

        it('should try to register with an invalid email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.register(RegisterRequestWithInvalidEmail).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 400, statusText: 'Bad Request' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', RegisterRequestWithInvalidEmail);
        });
    });

    describe('login', () => {
        it('should login with success', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(LoginRequest).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Success');

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', LoginRequest);
        });

        it('should try to login with bad password', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(LoginRequestWithBadPassword).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 401, statusText: 'Unauthorized' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', LoginRequestWithBadPassword);
        });

        it('should try to login with bad email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(LoginRequestWithBadEmail).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 404, statusText: 'Not Found' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', LoginRequestWithBadEmail);
        });
    });
});
