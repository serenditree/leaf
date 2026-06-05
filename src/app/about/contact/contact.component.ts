import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component(
    {
        selector: 'st-contact',
        templateUrl: './contact.component.html',
        styleUrls: ['./contact.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class ContactComponent {
}
