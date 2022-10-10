export class Point {
    private x: number;
    private y: number;

    constructor();
    constructor(x: number, y: number);
    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    private getDistance(point1: Point, point2: Point): number {
        const y = point2.x - point1.x;
        const x = point2.y - point1.y;

        return Math.sqrt(x * x + y * y);
    }

    distance(): number;
    distance(other?: Point): number;
    distance(x?: Point | number, y?: number): number {
        if (x instanceof Point) {
            return this.getDistance(this, x);
        } else if (typeof x === "number" && y) {
            return this.getDistance(this, new Point(x, y));
        } else {
            return this.getDistance(this, new Point());
        }
    }
}
