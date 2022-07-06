import { NgModule } from '@angular/core';
import { InviewDirective } from './inview.directive';
import { InviewContainerDirective } from './inview-container.directive';
import { InviewItemDirective } from './inview-item.directive';
import { ScrollObservable } from './utils/scroll-observable';
import { WindowRuler } from './utils/viewport-ruler';
@NgModule({
  imports: [],
  declarations: [InviewDirective, InviewContainerDirective, InviewItemDirective],
  exports: [InviewDirective, InviewContainerDirective, InviewItemDirective],
  providers: [ScrollObservable, WindowRuler]
})
export class NgInviewModule { }
