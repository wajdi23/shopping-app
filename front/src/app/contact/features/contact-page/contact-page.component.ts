import { Component } from "@angular/core";
import { ContactFormComponent } from "app/contact/ui/contact-form/contact-form.component";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [ContactFormComponent, CardModule],
  templateUrl: "./contact-page.component.html",
  styleUrl: "./contact-page.component.scss",
})
export class ContactPageComponent {}
