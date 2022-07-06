import { Component, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('individualwrapped') individualwrapped: any;

  trigger: any = new BehaviorSubject(0);
  stateIndividual: any = {};
  stateContainer: any = {};
  stateIndividualWrapped: any = {};
  elementIndividualWrapped = '';
  stateContainerWrapped: any = {};
  stateContainerBestWrapped: any = {};
  items = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.items.push({
        name: 'Item ' + i
      });
    }
  }

  ngOnInit() {
    this.elementIndividualWrapped = this.individualwrapped.nativeElement;
  }

  inViewIndividualWrapped($event) {
    this.stateIndividualWrapped = $event;
  }

  inViewIndividual($event) {
    this.stateIndividual = $event;
  }

  inViewContainer($event) {
    this.stateContainer = $event;
  }

  inViewContainerWrapped($event) {
    this.stateContainerWrapped = $event;
  }

  inViewContainerBestWrapped($event) {
    this.stateContainerBestWrapped = $event;
  }

  triggerCustom() {
    this.trigger.next(0);
  }

}
