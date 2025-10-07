import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "app/auth/auth.service";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";
import { PasswordModule } from "primeng/password";
import { MessagesModule } from "primeng/messages";
import { Message } from "primeng/api";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    PasswordModule,
    MessagesModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public readonly loginError = signal<string>("");

  protected readonly currentUser = this.authService.currentUser;
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected readonly loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  onLogin(panel: any): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loginForm.reset();
          panel.hide();
        },
        error: (error) => {
          this.loginError.set("Error");
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  logout(panel: any): void {
    this.authService.logout();
    panel.hide();
  }
}
