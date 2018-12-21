import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appStarHost]'
})
export class StarHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
