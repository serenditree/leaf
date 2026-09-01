import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy} from '@angular/core';

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

    @ViewChild('slideContent')
    private readonly _slideContent!: ElementRef<HTMLElement>;

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
        const slideElement = this._slideContent.nativeElement;

        if (this._isActive) {
            slideElement.style.height = slideElement.scrollHeight + 'px';
            setTimeout(() => slideElement.style.height = 'auto', 400);
        } else {
            slideElement.style.height = slideElement.scrollHeight + 'px';
            requestAnimationFrame(
                () => requestAnimationFrame(
                    () => {
                        slideElement.style.height = '0';
                    }
                )
            );
        }

        this._onToggle.emit(this._isActive);
    }
}
