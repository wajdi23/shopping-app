import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { ContactFormComponent } from "./contact/ui/contact-form/contact-form.component";

export const APP_ROUTES: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./auth/features/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES),
  },

  {
    path: "contact",
    loadComponent: () =>
      import("./contact/features/contact-page/contact-page.component").then(
        (m) => m.ContactPageComponent
      ),
  },

  { path: "", redirectTo: "home", pathMatch: "full" },
];
