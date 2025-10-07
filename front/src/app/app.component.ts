import { Component, inject, ViewChild } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ToolbarModule } from "primeng/toolbar";
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { AuthService } from "./auth/auth.service";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { LoginComponent } from "./auth/features/login/login.component";
import { CartViewComponent } from "./cart/features/cart-view/cart-view.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    RouterModule,
    SplitterModule,
    ToolbarModule,
    PanelMenuComponent,
    OverlayPanelModule,
    LoginComponent,
    CartViewComponent,
  ],
})
export class AppComponent {
  public readonly authService = inject(AuthService);
  public isAuthenticated = this.authService.isAuthenticated();

  title = "ALTEN SHOP";

  @ViewChild("userPanel") userPanel!: OverlayPanel;

  @ViewChild("cartPanel") cartPanel!: OverlayPanel;
}
