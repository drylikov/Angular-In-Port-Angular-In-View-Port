import { Directive, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ScrollObservable } from './utils/scroll-observable';
import { OffsetResolverFactory } from './utils/offset-resolver';
import { PositionResolver } from './utils/position-resolver';
import { ElementBoundingPositions } from './utils/models';
import { WindowRuler } from './utils/viewport-ruler';

import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[in-view]'
})
export class InviewDirective implements OnInit, OnDestroy, AfterViewInit {
  private _throttleType: string = 'debounce';
  private _offset: Array<number | string> = [0, 0, 0, 0];
  private _viewPortOffset: Array<number | string> = [0, 0, 0, 0];
  private _throttle: number = 0;
  private _scrollElement: HTMLElement;
  private _lazy: boolean = false; // when visible only then.
  private _tooLazy: boolean = false; // when state changes only then.
  private _previous_state: boolean;
  private _data: any;

  @Input()
  trigger: Subject<any>;

  @Input()
  set offset(offset: Array<number | string> | number | string) {
    this._offset = OffsetResolverFactory.create(offset).normalizeOffset();
  }
  @Input()
  set viewPortOffset(offset: Array<number | string> | number | string) {
    this._viewPortOffset = OffsetResolverFactory.create(offset).normalizeOffset();
  }
  @Input()
  set throttle(throttle: number) {
    this._throttle = throttle;
  }
  @Input()
  set scrollELement(sw: HTMLElement) {
    this._scrollElement = sw;
  }
  @Input()
  set lazy(lzy: boolean) {
    this._lazy = lzy;
  }
  @Input()
  set tooLazy(lzy: boolean) {
    this._tooLazy = lzy;
  }
  @Input()
  set data(_d: any) {
    this._data = _d;
  }
  @Output() private inview: EventEmitter<any> = new EventEmitter();
  private _scrollerSubscription: Subscription;

  constructor(
    private _scrollObservable: ScrollObservable,
    private _element: ElementRef,
    private _zone: NgZone,
    private _windowRuler: WindowRuler) { }

  ngAfterViewInit() {
    const observable = this.trigger ?
      Observable.merge(this._scrollObservable.scrollObservableFor(this._scrollElement || window), this.trigger)
      : this._scrollObservable.scrollObservableFor(this._scrollElement || window);

    this._scrollerSubscription = observable
    [this._throttleType](() => Observable.timer(this._throttle))
      .filter(() => true)
      .mergeMap((event: any) => Observable.of(this._getViewPortRuler()))
      .subscribe((containersBounds: ElementBoundingPositions) => this.handleOnScroll(containersBounds));
  }

  private _getViewPortRuler() {
    return this._scrollElement ? PositionResolver.getBoundingClientRect(this._scrollElement) : this._windowRuler.getWindowViewPortRuler();
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this._scrollerSubscription) {
      this._scrollerSubscription.unsubscribe();
    }
  }

  handleOnScroll(containersBounds: ElementBoundingPositions) {
    const viewPortOffsetRect = PositionResolver.offsetRect(containersBounds, this._viewPortOffset);
    const elementOffsetRect = PositionResolver.offsetRect(
      PositionResolver.getBoundingClientRect(this._element.nativeElement),
      this._offset
    );
    const isVisible = PositionResolver.isVisible(this._element.nativeElement)
      && PositionResolver.intersectRect(elementOffsetRect, viewPortOffsetRect);

    if (this._tooLazy && this._previous_state !== undefined && (this._previous_state === isVisible)) { return; }

    const output: any = { status: isVisible };

    if (this._data !== undefined) { output.data = this._data; }

    if (!this._lazy && !isVisible) {
      output.isClipped = false;
      output.isOutsideView = true;
      output.parts = { top: false, right: false, left: false, bottom: false };
      output.inViewPercentage = { vertical: 0, horizontal: 0 };
      this._zone.run(() => this.inview.emit(output));
    }

    if (!isVisible) { this._previous_state = isVisible; return; }

    const { isClipped, isOutsideView } = PositionResolver.clippedStatus(elementOffsetRect, viewPortOffsetRect);
    output.isClipped = isClipped;
    output.isOutsideView = isOutsideView;
    output.parts = PositionResolver.inViewParts(viewPortOffsetRect, elementOffsetRect);
    output.inViewPercentage = PositionResolver.inViewPercentage(viewPortOffsetRect, elementOffsetRect);
    this._zone.run(() => this.inview.emit(output));
    this._previous_state = isVisible;
  }
}
