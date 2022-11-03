import { Item } from "./Item";
import { ItemComparator } from "./ItemComparator";

export class Inventory {
    private items: Item[];

    addItem(item: Item): void {
        this.items.push(item);
    }

    sort(comparator?: ItemComparator): void {
        const defaultComparator = function (a: Item, b: Item): number {
            return a.compareTo(b);
        }
        this.items.sort(comparator?.compare || defaultComparator);
    }

    toString(): string {
        return this.items.join(', ');
    }
}