import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/service/auth.service';
import { ADMIN_PATHS, COOPERATIVE_PATHS } from '@/app/core/config/app-paths';
import { NotificationService } from '@/app/core/service/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  readonly backgroundImage = '/assets/img/background.gif';
  email = '';
  password = '';
  showPassword = false;
  userType: 'admin' | 'cooperative' = 'cooperative';
  rememberMe = false;
  isSubmitting = false;

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(): void {
    this.notifications.addNotification({
      title: 'Password reset',
      body: 'Password reset functionality will be implemented.',
      audience: 'All users'
    });
  }

  onRegisterHelp(): void {
    this.notifications.addNotification({
      title: 'Registration help',
      body: 'Contact your government administrator for registration.',
      audience: 'All users'
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (!this.password.trim()) {
      this.notifications.addNotification({
        title: 'Missing password',
        body: 'Please enter your password to continue.',
        audience: 'All users'
      });
      return;
    }
    this.isSubmitting = true;

    this.auth.login(this.email.trim(), this.password, this.userType).subscribe({
      next: (portalUser) => {
        this.notifications.addNotification({
          title: 'Signed in',
          body: `Welcome back, ${portalUser.email}.`,
          audience: portalUser.role === 'government_admin' ? 'Government Admin' : 'Cooperative'
        });
        this.isSubmitting = false;
        this.router.navigateByUrl(portalUser.role === 'government_admin' ? ADMIN_PATHS.home : COOPERATIVE_PATHS.home);
      },
      error: () => {
        this.notifications.addNotification({
          title: 'Sign-in failed',
          body: 'Invalid credentials or session service unavailable.',
          audience: 'All users'
        });
        this.isSubmitting = false;
      }
    });
  }
}