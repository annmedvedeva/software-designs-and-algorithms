import { Item } from "./Item";

export abstract class Consumable extends Item {
    private isConsumed: boolean;
    private isSpoiled: boolean;

    constructor(name: string, value: number, wieght: number, isSpoiled: boolean) {
        super(name, value, wieght);
        this.isConsumed = false;
        this.isSpoiled = isSpoiled;
    }

    eat(): string {
        return `"You eat the ${this.name}."`
    }

    use(): string {
        if (!this.isSpoiled && !this.isConsumed) {
            return this.eat();
        }
        if (this.isConsumed) {
            return `There is nothing left of the ${this.name} to consume.`;
        }
        return `${this.eat()} You feel sick.`;
    }

    protected setConsumed(consumed: boolean){
        this.isConsumed = consumed;
    }
}