import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px) scale(0.98)' }),
        animate('560ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class LoginComponent {
  isSubmitting = false;
  errorMessage = '';
  form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.message || 'Login failed';
      }
    });
  }
}