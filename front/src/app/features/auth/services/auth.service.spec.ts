import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoginRequest, LoginRequestWithBadEmail, LoginRequestWithBadPassword, RegisterRequest, RegisterRequestWithInvalidEmail } from "./auth.service.fixtures";

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
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
            service.register(RegisterRequest).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Success');
        });

        it('should try to register with an already registered email', () => {
            service.register(RegisterRequest).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 409, statusText: 'Conflict' });
        });

        it('should try to register with an invalid email', () => {
            service.register(RegisterRequestWithInvalidEmail).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('login', () => {
        it('should login with success', () => {
            service.login(LoginRequest).subscribe(auth => {
                expect(auth).toBeTruthy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Success');
        });

        it('should try to login with bad password', () => {
            service.login(LoginRequestWithBadPassword).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 401, statusText: 'Unauthorized' });
        });

        it('should try to login with bad email', () => {
            service.login(LoginRequestWithBadEmail).subscribe(auth => {
                expect(auth).toBeFalsy();
            });

            const req = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush('Error', { status: 404, statusText: 'Not Found' });
        });
    });
});
