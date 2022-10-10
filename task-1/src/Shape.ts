import { Point } from './Point';

export abstract class Shape {
  protected color: string;
  protected filled: boolean;
  protected points: Point[];

  constructor(points: Point[], color?: string, filled?: boolean);
  constructor(points: Point[], color: string, filled: boolean) {
    if (points.length < 3) {
      throw new Error;
    }

    this.points = points;
    this.color = color ?? "green";
    this.filled = filled ?? true;
  }

  private isLastIndex = (index: number, arrayLength: number) => index === arrayLength - 1;

  private getTotalPoints(): string {
    return this.points.map((point: Point) => point.toString()).join(', ');
  }

  toString(): string {
    return `A Shape with color of ${this.color} and ${this.filled ? 'filled' : 'not filled'}. Points: ${this.getTotalPoints()}.`
  }

  getPerimeter(): number {
    return this.points.reduce((perimeter: number, point: Point, currentIndex: number, points: Point[]) => {
      const index = this.isLastIndex(currentIndex, points.length) ? 0 : currentIndex + 1;
      return perimeter += point.distance(points[index]);
    }, 0);
  }

  abstract getType(): string;
}
