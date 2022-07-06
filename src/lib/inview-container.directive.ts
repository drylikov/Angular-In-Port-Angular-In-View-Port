import {
  Directive, ContentChildren, QueryList, OnInit, OnDestroy, AfterViewInit,
  Input, Output, EventEmitter, ElementRef, NgZone
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { InviewItemDirective } from './inview-item.directive';
import { ScrollObservable } from './utils/scroll-observable';
import { WindowRuler } from './utils/viewport-ruler';
import { OffsetResolverFactory } from './utils/offset-resolver';
import { PositionResolver } from './utils/position-resolver';
import { ElementBoundingPositions } from './utils/models';


import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';


// allmost same configuration as child
// child will not have inview property? to trigger changes
// will use scroll on this or window
// will check wheather the child is in view port
// will start checking from last inview child and with direction of scroll until a child is not visible
// can return all inview children
// or best match case
// if container is used then first check if container itself is in the viewport of the window.
// then only the futher calculation should take place

@Directive({
  selector: '[in-view-container]'
})
export class InviewContainerDirective implements OnInit, OnDestroy, AfterViewInit {
  private _scrollSuscription: Subscription;
  private _throttleType: string = 'debounce';
  private _offset: Array<number | string> = [0, 0, 0, 0];
  private _viewPortOffset: Array<number | string> = [0, 0, 0, 0];
  private _throttle: number = 0;
  private _scrollWindow: boolean = true;
  private _data: any;
  private _bestMatch: boolean;
  private _lastScrollY: number = 0;
  private _scrollDirection: string = 'down';

  @Input() trigger: Subject<any>;
  @Input()
  set offset(offset: Array<number | string> | number | string) {
    this._offset = OffsetResolverFactory.create(offset).normalizeOffset();
  }
  @Input()
  set viewPortOffset(offset: Array<number> | number | string) {
    this._viewPortOffset = OffsetResolverFactory.create(offset).normalizeOffset();
  }
  @Input()
  set throttle(throttle: number) {
    this._throttle = throttle;
  }
  @Input()
  set scrollWindow(sw: boolean) {
    this._scrollWindow = !!sw;
  }
  @Input()
  set data(_d: any) {
    this._data = _d;
  }
  @Input()
  set bestMatch(bm: any) {
    this._bestMatch = !!bm;
  }

  @Output() inview: EventEmitter<any> = new EventEmitter();
  @ContentChildren(InviewItemDirective) private _inviewChildren: QueryList<InviewItemDirective>;

  constructor(
    private _element: ElementRef,
    private _scrollObservable: ScrollObservable,
    private _windowRuler: WindowRuler,
    private _zone: NgZone
  ) { }

  ngOnInit() { }
  ngAfterViewInit() {
    const observable = this.trigger ?
      Observable.merge(this._scrollObservable.scrollObservableFor(this._scrollWindow ? window : this._element.nativeElement), this.trigger)
      : this._scrollObservable.scrollObservableFor(this._scrollWindow ? window : this._element.nativeElement);

    this._scrollSuscription = observable
    [this._throttleType](() => Observable.timer(this._throttle))
      .filter(() => true)
      .mergeMap((event: any) => Observable.of(this._getViewPortRuler()))
      .do(() => this._checkScrollDirection())
      .subscribe((containersBounds: ElementBoundingPositions) => this.handleOnScroll(containersBounds));

  }

  private _checkScrollDirection() {
    if (this._scrollWindow) {
      this._scrollDirection = (window.scrollY > this._lastScrollY) ? 'down' : 'up';
      this._lastScrollY = window.scrollY;
    } else {
      this._scrollDirection = (this._element.nativeElement.scrollTop > this._lastScrollY) ? 'down' : 'up';
      this._lastScrollY = this._element.nativeElement.scrollTop;
    }
  }

  private _getViewPortRuler() {
    return this._scrollWindow ?
      this._windowRuler.getWindowViewPortRuler() :
      PositionResolver.getBoundingClientRect(this._element.nativeElement);
  }
  ngOnDestroy() {
    if (this._scrollSuscription) {
      this._scrollSuscription.unsubscribe();
    }
  }

  handleOnScroll(containersBounds: ElementBoundingPositions) {
    // check of scroll up or down
    // Note:: check all children from parent if it is in view or not
    // for cache of less iterations start from the last visible  item then based on scroll up and down check list futher
    const viewPortOffsetRect = PositionResolver.offsetRect(containersBounds, this._viewPortOffset);
    let visibleChildren: Array<any> = [];
    if (this._inviewChildren) {
      visibleChildren = this._inviewChildren.toArray().filter((child: InviewItemDirective) => {
        const elementOffsetRect = PositionResolver.offsetRect(child.getELementRect(), this._offset);
        return child.isVisible() && PositionResolver.intersectRect(elementOffsetRect, viewPortOffsetRect);
      });
      if (this._bestMatch) {
        let bestMatchChild: InviewItemDirective | any = 0;
        if (visibleChildren.length) {
          visibleChildren.reduce((distance: number, currChild: InviewItemDirective) => {
            const _distance = PositionResolver.distance(
              viewPortOffsetRect,
              PositionResolver.offsetRect(currChild.getELementRect(), this._offset)
            );
            if (distance > _distance) {
              bestMatchChild = currChild;
              return _distance;
            }
            return distance;
          }, Infinity);
        }
        const data: any = bestMatchChild ? bestMatchChild.getData() : {};
        data.direction = this._scrollDirection;
        this._zone.run(() => this.inview.emit(data));
      } else {
        const data: any = {};
        data.inview = visibleChildren.map((vc: InviewItemDirective) => vc.getData());
        data.direction = this._scrollDirection;
        this._zone.run(() => this.inview.emit(data));
      }

    }
  }

}


//  inview-container -> inview-item ->

//  scrollWindow =  true -> will test it against the window scroll event with container.
//  scrollWindow = false -> means we need to attach scroll event on this container.

// inview ->  directly used against the window.
