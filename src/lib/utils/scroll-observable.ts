import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { WindowRuler } from './viewport-ruler';
import { WindowElement } from './models';



@Injectable()
export class ScrollObservable {
  static _globalObservable: Observable<any>;
  static _elementObservableReferences: Map<WindowElement, Observable<any>> = new Map();
  static isWindow(windowElement: WindowElement) {
    return Object.prototype.toString.call(windowElement).includes('Window');
  }
  constructor(private _windowRuler: WindowRuler) {
    if (!ScrollObservable._globalObservable) {
      ScrollObservable._globalObservable = this._getGlobalObservable();
    }
  }
  private _getGlobalObservable(): Observable<any> {
    return Observable.merge(
      Observable.fromEvent(window.document, 'scroll'),
      Observable.fromEvent(window, 'resize')
      .map((event: any) => {
        this._windowRuler.onChange();
        return event;
    })
    ).share();
  }
  scrollObservableFor(windowElement: WindowElement): Observable<any> {
    if (ScrollObservable.isWindow(windowElement)) {
      return ScrollObservable._globalObservable;
    }
    if (ScrollObservable._elementObservableReferences.has(windowElement)) {
      return <Observable<any>>ScrollObservable._elementObservableReferences.get(windowElement);
    }
    const ref = this._createElementObservable(windowElement);
    ScrollObservable._elementObservableReferences.set(windowElement, ref);
    return ref;
  }
  private _createElementObservable(windowElement: WindowElement): Observable<any> {
    return Observable.fromEvent(windowElement, 'scroll').share();
  }

}
