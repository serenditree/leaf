import {AfterContentChecked} from '@angular/core';
import {Directive} from '@angular/core';
import {ElementRef} from '@angular/core';
import {Input} from '@angular/core';

@Directive({selector: '[stFocus]'})
export class StFocusDirective implements AfterContentChecked {

    private _focus = true;
    private _hasFocus = false;

    constructor(private _elementRef: ElementRef) {
    }

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
