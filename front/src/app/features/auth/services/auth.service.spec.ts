import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { FIX_LOGIN_USER_INFORMATIONS, FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_EMAIL, FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_PASSWORD, FIX_REGISTER_USER_INFORMATIONS, FIX_REGISTER_USER_INFORMATIONS_WITH_INVALID_EMAIL } from "./auth.service.fixtures";
import { HttpClient, HttpClientModule } from "@angular/common/http";
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

            service.register(FIX_REGISTER_USER_INFORMATIONS).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(FIX_REGISTER_USER_INFORMATIONS);
            req.flush('Success');

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', FIX_REGISTER_USER_INFORMATIONS);
        });

        it('should try to register with an already registered email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.register(FIX_REGISTER_USER_INFORMATIONS).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 409, statusText: 'Conflict' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', FIX_REGISTER_USER_INFORMATIONS);
        });

        it('should try to register with an invalid email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.register(FIX_REGISTER_USER_INFORMATIONS_WITH_INVALID_EMAIL).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 400, statusText: 'Bad Request' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/register', FIX_REGISTER_USER_INFORMATIONS_WITH_INVALID_EMAIL);
        });
    });

    describe('login', () => {
        it('should login with success', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(FIX_LOGIN_USER_INFORMATIONS).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Success');

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', FIX_LOGIN_USER_INFORMATIONS);
        });

        it('should try to login with bad password', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_PASSWORD).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 401, statusText: 'Unauthorized' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_PASSWORD);
        });

        it('should try to login with bad email', () => {
            const postSpy = jest.spyOn(HttpClient.prototype, 'post');

            service.login(FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_EMAIL).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 404, statusText: 'Not Found' });

            expect(postSpy).toHaveBeenCalledWith('api/auth/login', FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_EMAIL);
        });
    });
});
