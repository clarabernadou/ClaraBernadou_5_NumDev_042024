import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoginRequest, LoginRequestWithBadPassword, RegisterRequest } from "./auth.service.fixtures";

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

    it('should register with success', () => {
        service.register(RegisterRequest).subscribe();

        const req = httpMock.expectOne('api/auth/register');
        expect(req.request.method).toBe('POST');
    });

    it('should login with success', () => {
        service.login(LoginRequest).subscribe();

        const req = httpMock.expectOne('api/auth/login');
        expect(req.request.method).toBe('POST');
    });

    it('should try to login with bad password', () => {
        service.login(LoginRequestWithBadPassword).subscribe();

        const req = httpMock.expectOne('api/auth/login');
        expect(req.request.method).toBe('POST');

        req.flush('Error', { status: 401, statusText: 'Unauthorized' });
    });
});
