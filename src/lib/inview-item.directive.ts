import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { PositionResolver } from './utils/position-resolver';
@Directive({
  selector: '[in-view-item]'
})
export class InviewItemDirective implements OnInit {
  private _data: any;
  private _id: any;
  @Input()
  set data(d: any) {
    this._data = d;
  }
  @Input()
  set id(_id: any) {
    this._id = _id;
  }
  constructor(private _element: ElementRef) { }
  ngOnInit() {
  }

  // expose a function returning rect of this _element
  getELementRect(): ClientRect {
    return PositionResolver.getBoundingClientRect(this._element.nativeElement);
  }
  isVisible(): boolean {
    return PositionResolver.isVisible(this._element.nativeElement);
  }
  getData(): any {
    return { id: this._id, data: this._data };
  }
}
