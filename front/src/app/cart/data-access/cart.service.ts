import { HttpClient } from "@angular/common/http";
import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from "@angular/core";
import { environment } from "environments/environment";
import { Cart, CartItem } from "./cart.model";
import { catchError, Observable, of, tap } from "rxjs";
import { AuthService } from "app/auth/auth.service";

export interface AddCartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly path = `${environment.apiUrl}/cart`;

  private readonly _cartItems = signal<CartItem[]>([]);
  private readonly _total = signal<number>(0);

  public readonly cartItems = this._cartItems.asReadonly();
  public readonly total = this._total.asReadonly();

  public readonly itemCount = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  public readonly totalPrice = computed(() =>
    this._cartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  constructor() {
    effect(() => {
      const items = this._cartItems();
      console.log(items);
    });

    effect(
      () => {
        const isAuthenticated = this.authService.isAuthenticated();

        if (!isAuthenticated) {
          this.clearCartLogout();
        } else {
          this.loadCart().subscribe();
        }
      },
      { allowSignalWrites: true }
    );
  }

  public addToCart(
    productId: number,
    quantity: number = 1
  ): Observable<CartItem> {
    console.log("productId", productId);
    console.log("quantity", quantity);
    return this.http.post<CartItem>(this.path, { productId, quantity }).pipe(
      tap((cartItem) => {
        const existingIndex = this._cartItems().findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
          this._cartItems.update((items) =>
            items.map((item, index) =>
              index === existingIndex ? cartItem : item
            )
          );
        } else {
          this._cartItems.update((items) => [...items, cartItem]);
        }

        this.recalculateTotal();
      }),
      catchError((error) => {
        console.error("Erreur ajout au panier:", error);
        throw error;
      })
    );
  }

  public updateQuantity(
    productId: number,
    newQuantity: number
  ): Observable<CartItem> {
    console.log(productId, newQuantity);

    return this.http
      .patch<CartItem>(`${this.path}/${productId}`, { quantity: newQuantity })
      .pipe(
        catchError((error) => {
          console.log(error);
          throw error;
        }),
        tap((updatedItem) => {
          this._cartItems.update((items) =>
            items.map((item) =>
              item.productId === productId ? updatedItem : item
            )
          );
          this.recalculateTotal();
        })
      );
  }

  public loadCart(): Observable<Cart> {
    return this.http.get<Cart>(this.path).pipe(
      catchError((error) => {
        console.error("Erreur chargement panier:", error);
        return of({ items: [], total: 0, itemCount: 0 });
      }),
      tap((response) => {
        this._cartItems.set(response.items);
        this._total.set(response.total);
      })
    );
  }

  private recalculateTotal(): void {
    const total = this._cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    this._total.set(total);
  }

  public clearCart(): Observable<any> {
    return this.http.delete(this.path).pipe(
      tap(() => {
        this._cartItems.set([]);
        this._total.set(0);
      })
    );
  }

  public removeFromCart(productId: number): Observable<any> {
    return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
      catchError(() => {
        return of(true);
      }),
      tap(() =>
        this._cartItems.update((items) =>
          items.filter((item) => item.productId !== productId)
        )
      )
    );
  }

  public clearCartLogout(): void {
    this._cartItems.set([]);
    this._total.set(0);
  }

  public getQuantity(productId: number): number {
    return (
      this._cartItems().find((el) => el.productId === productId)?.quantity ?? 0
    );
  }
}
