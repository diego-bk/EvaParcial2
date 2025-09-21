import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from '../../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty login data', () => {
    expect(component.loginData.username).toBe('');
    expect(component.loginData.password).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
  });

  it('should call authService.login on form submit', () => {
    mockAuthService.login.and.returnValue(of(true));
    component.loginData.username = 'testuser';
    component.loginData.password = 'testpass';

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'testpass');
  });

  it('should navigate to dashboard on successful login', () => {
    mockAuthService.login.and.returnValue(of(true));
    component.loginData.username = 'testuser';
    component.loginData.password = 'testpass';

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed login', () => {
    mockAuthService.login.and.returnValue(of(false));
    component.loginData.username = 'testuser';
    component.loginData.password = 'wrongpass';

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
