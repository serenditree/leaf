import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

@Component(
    {
        selector: 'st-menu',
        templateUrl: './menu.component.html',
        styleUrls: ['./menu.component.scss'],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MenuComponent {
}
