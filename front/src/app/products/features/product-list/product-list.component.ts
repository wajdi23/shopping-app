import { CurrencyPipe } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "app/auth/auth.service";
import { CartService } from "app/cart/data-access/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { TagModule } from "primeng/tag";
import { PanelMenuModule } from "primeng/panelmenu";
import { TooltipModule } from "primeng/tooltip";
import { InventaryStatusPipe } from "app/shared/pipes/inventary-status.pipe";
import { InventoryStatus } from "app/shared/constants/enums";
import { PaginatorModule } from "primeng/paginator";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    TagModule,
    CurrencyPipe,
    InputNumberModule,
    FormsModule,
    PanelMenuModule,
    TooltipModule,
    InventaryStatusPipe,
    PaginatorModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  protected readonly isAdmin = this.authService.isAdmin;
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected getQuantity = (productId: number) =>
    this.cartService.getQuantity(productId);

  public readonly products = this.productsService.products;

  readonly InventaryStatus = InventoryStatus;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  productsLength = computed(() => this.products().length);

  paginatedProducts = computed(() => {
    const filtered = this.products();
    const start = this.first();
    const end = start + this.rows();
    return filtered.slice(start, end);
  });

  first = signal<number>(0);
  rows = signal<number>(5);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public onAddToCart(product: Product) {
    console.log(product);

    this.cartService.addToCart(product.id).subscribe();
  }

  public onQuantityChange(product: Product, newQuantity: number) {
    let currentQuantity = this.cartService.getQuantity(product.id);
    console.log("product.id", product.id);
    console.log("newQuantity", newQuantity);

    if (currentQuantity) {
      this.cartService.updateQuantity(product.id, newQuantity).subscribe();
    } else {
      console.log("not");
    }
  }

  onPageChange(event: any) {
    console.log(event);
    this.first.set(event.first);
    this.rows.set(event.rows);
  }
}
