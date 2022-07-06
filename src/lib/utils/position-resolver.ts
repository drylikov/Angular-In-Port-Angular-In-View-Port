import { ElementBoundingPositions, Point } from './models';
function isPercent(value: any): boolean {
  return typeof value === 'string' && value.indexOf('%') > -1;
}
function distance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
export class PositionResolver {
  static getBoundingClientRect(element: HTMLElement): ClientRect {
    return element.getBoundingClientRect();
  }

  static isVisible(element: HTMLElement): boolean {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }

  static intersectRect(r1: any, r2: any): boolean {
    return !(r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
  }

  static offsetRect(rect: any, offset: Array<any>): ClientRect {
    if (!offset) {
      return rect;
    }
    const offsetObject: any = {
      top: isPercent(offset[0]) ? (parseFloat(offset[0]) * rect.height) / 100 : +offset[0],
      right: isPercent(offset[1]) ? (parseFloat(offset[1]) * rect.width) / 100 : +offset[1],
      bottom: isPercent(offset[2]) ? (parseFloat(offset[2]) * rect.height) / 100 : +offset[2],
      left: isPercent(offset[3]) ? (parseFloat(offset[3]) * rect.width) / 100 : +offset[3]
    };
    return {
      top: rect.top - offsetObject.top,
      left: rect.left - offsetObject.left,
      bottom: rect.bottom + offsetObject.bottom,
      right: rect.right + offsetObject.right,
      height: rect.height + offsetObject.top + offsetObject.bottom,
      width: rect.width + offsetObject.left + offsetObject.right
    };
  }

  static distance(containerRect: any, elementRect: any) {
    const middlePointOfContainer: Point = {
      x: containerRect.height / 2,
      y: containerRect.width / 2
    };
    const middlePointOfElement: Point = {
      x: elementRect.top + (elementRect.height / 2),
      y: elementRect.left + (elementRect.width / 2)
    };
    return distance(middlePointOfContainer, middlePointOfElement);
  }

  static inviewPercentage(containerRect: any, elementRect: any) {
    return {
      top: 100 * elementRect.top / containerRect.top,
      left: 100 * elementRect.left / containerRect.left,
      bottom: 100 * elementRect.bottom / containerRect.bottom,
      right: 100 * elementRect.right / containerRect.right
    };
  }

  static inViewParts(containerRect: any, elementRect: any) {
    return {
      top: elementRect.top >= containerRect.top,
      left: elementRect.left >= containerRect.left,
      bottom: elementRect.bottom <= containerRect.bottom,
      right: elementRect.right <= containerRect.right
    };
  }

  static inViewPercentage(containerRect: any, elementRect: any) {

    const elementHeight = elementRect.bottom - elementRect.top;
    const containerHeight = containerRect.bottom - containerRect.top;

    const elementWidth = elementRect.right - elementRect.left;
    const containerWidth = containerRect.right - containerRect.left;

    const diffAbove = containerHeight - (elementRect.top - containerRect.top);
    const diffBelow = containerHeight - (containerRect.bottom - elementRect.bottom);
    const diffLeft = containerWidth - (elementRect.left - containerRect.left);
    const diffRight = containerWidth - (containerRect.right - elementRect.right);

    const verticalAbove = (diffAbove * 100) / elementHeight;
    const verticalBelow = (diffBelow * 100) / elementHeight;

    const horizontalLeft = (diffLeft * 100) / elementWidth;
    const horizontalRight = (diffRight * 100) / elementWidth;

    return {
      vertical: Math.min(100, verticalAbove, verticalBelow),
      horizontal: Math.min(100, horizontalLeft, horizontalRight)
    };
  }

  static isElementOutsideView(
    elementBounds: ElementBoundingPositions,
    containersBounds: ElementBoundingPositions): boolean {
    const outsideAbove = elementBounds.bottom < containersBounds.top;
    const outsideBelow = elementBounds.top > containersBounds.bottom;
    const outsideLeft = elementBounds.right < containersBounds.left;
    const outsideRight = elementBounds.left > containersBounds.right;
    return outsideAbove || outsideBelow || outsideLeft || outsideRight;

  }

  static isElementClipped(
    elementBounds: ElementBoundingPositions,
    containersBounds: ElementBoundingPositions): boolean {
    const clippedAbove = elementBounds.top < containersBounds.top;
    const clippedBelow = elementBounds.bottom > containersBounds.bottom;
    const clippedLeft = elementBounds.left < containersBounds.left;
    const clippedRight = elementBounds.right > containersBounds.right;

    return clippedAbove || clippedBelow || clippedLeft || clippedRight;
  }
  static clippedStatus(
    elementBounds: ElementBoundingPositions,
    containersBounds: ElementBoundingPositions) {
    return {
      isClipped: this.isElementClipped(elementBounds, containersBounds),
      isOutsideView: this.isElementOutsideView(elementBounds, containersBounds)
    };
  }

}
