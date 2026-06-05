import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from '@angular/core';

@Component(
    {
        selector: 'st-toggle',
        templateUrl: './toggle.component.html',
        styleUrls: ['./toggle.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class ToggleComponent {

    private _isActive = false;
    private _name!: string;
    private readonly _onToggle = new EventEmitter<boolean>();

    get isActive(): boolean {
        return this._isActive;
    }

    get name(): string {
        return this._name;
    }

    @Input()
    set name(value: string) {
        this._name = value;
    }

    @Output()
    get onToggle(): EventEmitter<boolean> {
        return this._onToggle;
    }

    public onSlideToggle(): void {
        this._isActive = !this._isActive;

        this._onToggle.emit(this._isActive);
    }
}
