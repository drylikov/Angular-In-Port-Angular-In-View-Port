# Angular In Port / Angular In View Port

## Inview Directive 

npm install angular-inport

## Importing module 
 
```js
import { NgInviewModule } from 'angular-inport'; 
@NgModule({                                   
    imports: [
        ....,                                
        NgInviewModule                       
    ],
    declarations: [YourAppComponent ],
    exports: [YourAppComponent],
    bootstrap: [YourAppComponent],
})
.....


```




#### Basic Usages

```html

<div in-view (inview)="inview($event)">
</div>    


```

#### Advanced Usages

```html

<div in-view
          (inview)="inview($event)"
          [offset]="[top, right, bottom, left]" or "[top/bottom, left/right]" or "[top/bottom/left/right]"
          [viewPortOffset]="[top, right, bottom, left]" or "[top/bottom, left/right]" or "[top/bottom/left/right]"
          [throttle]="[Number in ms to limit the inview event]"
          [scrollELement]="parent element reference on which scrolling applied" 
          [trigger]="An Observable ex. BehaviorSubject"
          >
          .......
</div>

```

## InviewContainer and InviewItem Directive

#### Basic Usages

```html

<div in-view-container (inview)="inview($event)">
   <div in-view-item *ngFor="let item of items; let i = index;" [id]="index" [data]="item">
     .......
   </div>
</div>

```


#### Advanced Usages

```html

<div in-view-container 
                    (inview)="inview($event)"
                    [offset]="[top, right, bottom, left]" or "[top/bottom, left/right]" or "[top/bottom/left/right]"
                    [viewPortOffset]="[top, right, bottom, left]" or "[top/bottom, left/right]" or "[top/bottom/left/right]"
                    [throttle]="[Number in ms to limit the inview event]"
                    [bestMatch]="when true, inview will return only one element closet to viewport center"
                    [trigger]="An Observable ex. BehaviorSubject"
                    >
   <div in-view-item *ngFor="let item of items; let i = index;" [id]="index" [data]="item">
     .......
   </div>
</div>

```
