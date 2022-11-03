import { Item } from "./Item";

export abstract class Weapon extends Item {
    static MODIFIER_CHANGE_RATE = 0.05;
    protected baseDamage: number;
    private baseDurability: number;

    protected durabilityModifier = Weapon.MODIFIER_CHANGE_RATE;
    protected damageModifier = Weapon.MODIFIER_CHANGE_RATE;

    constructor(name: string, baseDamage: number, baseDurability: number, value: number, weight: number) {
        super(name, value, weight);
        this.baseDamage = baseDamage;
        this.baseDurability = baseDurability;
    }

    private getDamage(): number {
        return this.baseDamage + this.damageModifier;
    }

    private getDurability(): number {
        return this.baseDurability + this.durabilityModifier;
    }

    toString(): string {
        return `${this.name} − Value: ${this.value.toFixed(2)}, Weight: ${this.weight.toFixed(2)}, Damage: ${this.getDamage().toFixed(2)}, Durability: ${this.getDurability().toFixed(2)}%`
    }

    use(): string {
        if (this.getDurability() <= 0) {
            return `You can't use the ${this.name}, it is broken.`;
        }
        this.durabilityModifier -= Weapon.MODIFIER_CHANGE_RATE;
        const defaultMessage = `You use the ${this.name}, dealing ${this.getDamage().toFixed(2)} points of damage.`;
        if (this.getDurability() <= 0) {
            return defaultMessage + ` The ${this.name} breaks.`
        }
        return defaultMessage;
    }
}
