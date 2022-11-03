import { Comparable } from './Comparable';

let counter = 0;

export abstract class Item implements Comparable<Item> {
    protected name: string;
    protected value: number;
    public weight: number;
    private id: number;

    constructor(name: string, value: number, weight: number) {
        this.id = counter++;
        this.name = name;
        this.value = value;
        this.weight = weight;
    }

    static get numberOfItems() {
        return counter;
    }

    compareTo(other: Item): number {
        if (this.value !== other.value) {
            return this.value > other.value ? 1 : -1;
        } else {
            return this.name.toLowerCase() > other.name.toLowerCase() ? 1 : -1;
        }
    }

    toString(): string {
        return `${this.name} - Value: ${this.value}, Weight: ${this.weight}`;
    }

    static reset() {
        counter = 0;
    }
}