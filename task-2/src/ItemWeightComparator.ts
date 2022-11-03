import { Item } from './Item';
import { ItemComparator } from './ItemComparator';

export class ItemWeightComparator implements ItemComparator {
    public compare(first: Item, second: Item) {
        if (first.weight !== second.weight) {
            return first.weight > second.weight ? 1 : -1;
        }
        return first.compareTo(second);
    }
}
