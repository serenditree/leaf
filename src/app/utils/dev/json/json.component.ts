import {Component, Input} from '@angular/core';

@Component(
    {
        selector: 'st-json',
        templateUrl: './json.component.html',
        styleUrls: ['./json.component.scss'],
        standalone: false
    }
)
export class JsonComponent {

    private _object: any;
    private _isActive = false;

    @Input()
    set object(object: any) {
        this._object = object;
    }

    get object(): any {
        return this._object;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    public toggleJson(): void {
        this._isActive = !this._isActive;
    }
}
