import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { LucideAngularModule, Check, Circle, Eye, EyeOff, Loader2, LogOut, ShieldCheck } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

interface PasswordRule {
  label: string;
  passed: boolean;
}

/**
 * Blocking modal shown when a user signs in with an admin-assigned initial password,
 * enforcing a new password that meets all security pattern requirements.
 */
@Component({
  selector: 'app-force-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './force-password-modal.component.html'
})
export class ForcePasswordModalComponent {
  @Output() passwordChanged = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  isSaving = false;
  error = '';

  readonly ShieldCheck = ShieldCheck;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Check = Check;
  readonly Circle = Circle;
  readonly Loader2 = Loader2;
  readonly LogOut = LogOut;

  constructor(private readonly authService: AuthService) {}

  get hasMinLength(): boolean {
    return this.newPassword.length >= 10;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get hasSpecialChar(): boolean {
    return /[^A-Za-z0-9\s]/.test(this.newPassword);
  }

  get rules(): PasswordRule[] {
    return [
      { label: 'Mínimo 10 caracteres', passed: this.hasMinLength },
      { label: 'Mínimo una mayúscula (A–Z)', passed: this.hasUppercase },
      { label: 'Mínimo un número (0–9)', passed: this.hasNumber },
      { label: 'Mínimo un carácter especial (. ! ? @ # $ etc.)', passed: this.hasSpecialChar }
    ];
  }

  get passedRulesCount(): number {
    return this.rules.filter(r => r.passed).length;
  }

  get allRulesPassed(): boolean {
    return this.passedRulesCount === this.rules.length;
  }

  get isDifferentFromCurrent(): boolean {
    return !this.currentPassword || !this.newPassword || this.newPassword !== this.currentPassword;
  }

  get passwordsMatch(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword === this.confirmPassword;
  }

  get canSubmit(): boolean {
    return (
      !this.isSaving &&
      this.currentPassword.length > 0 &&
      this.allRulesPassed &&
      this.isDifferentFromCurrent &&
      this.passwordsMatch
    );
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      return;
    }

    const id = localStorage.getItem('id');
    if (!id) {
      this.error = 'No se pudo identificar tu sesión. Vuelve a iniciar sesión.';
      return;
    }

    this.error = '';
    this.isSaving = true;

    this.authService.changePassword({
      id,
      role: localStorage.getItem('role'),
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (resp) => {
        if (resp?.success === true) {
          localStorage.setItem('mustChangePassword', 'false');
          this.passwordChanged.emit();
        } else {
          this.error = resp?.mensaje || 'No se pudo actualizar la contraseña.';
        }
      },
      error: (err) => {
        this.error = err?.error?.mensaje || 'No se pudo actualizar la contraseña.';
      }
    });
  }
}
