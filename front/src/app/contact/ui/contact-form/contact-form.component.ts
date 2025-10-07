import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Message } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    MessagesModule,
  ],
  templateUrl: "./contact-form.component.html",
  styleUrl: "./contact-form.component.scss",
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  public readonly successMessage = signal<Message[] | null>(null);
  public readonly isSubmitting = signal<boolean>(false);

  protected readonly contactForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    message: ["", [Validators.required, Validators.maxLength(300)]],
  });

  get messageLength(): number {
    return this.contactForm.get("message")?.value?.length || 0;
  }

  onSubmitContactForm() {
    this.isSubmitting.set(true);
    console.log("Formulaire:::", this.contactForm.value);
    this.successMessage.set([
      {
        severity: "success",
        detail: "Demande de contact envoyée avec succès",
      },
    ]);
    this.contactForm.reset();
    this.isSubmitting.set(false);

    setTimeout(() => {
      this.successMessage.set(null);
    }, 5000);
  }
}
