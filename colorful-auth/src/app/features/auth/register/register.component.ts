import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px) scale(0.98)' }),
        animate('560ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class RegisterComponent {
  isSubmitting = false;
  errorMessage = '';
  form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  get mismatch() { return this.form.errors?.['passwordsMismatch']; }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.value;

    this.isSubmitting = true;
    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.message || 'Registration failed';
      }
    });
  }
}