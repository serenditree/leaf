import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';

@Component(
    {
        selector: 'st-nav-container',
        templateUrl: './nav-container.component.html',
        styleUrls: ['./nav-container.component.scss'],
        encapsulation: ViewEncapsulation.None
    }
)
export class NavContainerComponent {

    private _responsive = true;
    private _align: string;

    get responsive(): boolean {
        return this._responsive;
    }

    @Input()
    set responsive(value: boolean) {
        this._responsive = value;
    }

    get align(): string {
        return this._align;
    }

    @Input()
    set align(value: string) {
        this._align = value;
    }
}
