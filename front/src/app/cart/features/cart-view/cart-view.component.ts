import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CartService } from "app/cart/data-access/cart.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { InputNumberModule } from "primeng/inputnumber";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DividerModule } from "primeng/divider";
import { BadgeModule } from "primeng/badge";
import { ToastModule } from "primeng/toast";
import { AuthService } from "app/auth/auth.service";
import { PanelMenuModule } from "primeng/panelmenu";

@Component({
  selector: "app-cart-view",
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    DataViewModule,
    CardModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    DividerModule,
    BadgeModule,
    ToastModule,
    PanelMenuModule,
  ],
  templateUrl: "./cart-view.component.html",
  styleUrl: "./cart-view.component.scss",
})
export class CartViewComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected readonly itemsCount = this.cartService.itemCount;
  protected readonly cartItems = this.cartService.cartItems;
  protected readonly totalPrice = this.cartService.totalPrice;

  protected updateQuantity(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity).subscribe();
  }

  // ngOnInit() {
  //   if (this.isAuthenticated()) {
  //     this.cartService.loadCart().subscribe();
  //   }
  // }

  protected clearCart() {
    this.cartService.clearCart().subscribe();
  }

  protected onDeleteFromCart(productId: number) {
    this.cartService.removeFromCart(productId).subscribe();
  }
}
