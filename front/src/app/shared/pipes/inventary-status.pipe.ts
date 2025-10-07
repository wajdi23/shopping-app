import { Pipe, PipeTransform } from "@angular/core";
import { InventoryStatus } from "../constants/enums";

@Pipe({
  name: "inventaryStatus",
  standalone: true,
})
export class InventaryStatusPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string | null {
    switch (value) {
      case InventoryStatus.INSTOCK:
        return "En stock";
      case InventoryStatus.LOWSTOCK:
        return "Stock faible";
      case InventoryStatus.OUTOFSTOCK:
        return "En rupture";
      default:
        return "Bientôt disponible";
    }
  }
}
