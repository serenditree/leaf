import {AfterContentChecked, Directive, ElementRef, Input, inject} from '@angular/core';

@Directive({selector: '[stFocus]'})
export class StFocusDirective implements AfterContentChecked {
    private _elementRef = inject(ElementRef);

    private _focus = true;
    private _hasFocus = false;

    @Input()
    set stFocus(value: boolean) {
        this._focus = value;
    }

    ngAfterContentChecked(): void {
        if (this._focus && !this._hasFocus) {
            this._elementRef.nativeElement.focus();
            this._hasFocus = true;
        }
    }
}
