import { Shape } from './Shape';
import { Point } from './Point';

export class Triangle extends Shape {
    constructor(point1: Point, point2: Point, point3: Point, color?: string, filled?: boolean) {
        super([point1, point2, point3], color, filled);
        this.points = [point1, point2, point3];
    }

    private getPointsValues(): string {
        return this.points.reduce((result: string, point: Point, index: number) => {
            return result += `v${index + 1}=${point.toString()}` + `${index === 2 ? '' : ','}`
        }, '');
    }

    toString(): string {
        return `Triangle[${this.getPointsValues()}]`;
    }

    private roundedDistance(point: Point, index: number) {
        return Math.round(point.distance(this.points[index]) * 10);
    }

    getType(): string {
        const sides = [] as number[];
        this.points.forEach((point: Point, currentIndex: number) => {
            const index = currentIndex === 2 ? 0 : currentIndex + 1;
            sides.push(this.roundedDistance(point, index));
        });

        const uniqueValuesAmount = new Set(sides).size;
        if (uniqueValuesAmount === sides.length) {
            return 'scalene triangle';
        } else if (uniqueValuesAmount === 1) {
            return 'equilateral triangle';
        } else {
            return 'isosceles triangle';
        }
    }
}
