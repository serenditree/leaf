import {MAT_SNACK_BAR_DATA, MatSnackBarConfig} from '@angular/material/snack-bar';
import {Component, inject, ChangeDetectionStrategy} from '@angular/core';

@Component(
    {
        selector: 'st-message-component',
        templateUrl: './message.component.html',
        styleUrls: ['./message.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MessageComponent {
    data = inject<MatSnackBarConfig>(MAT_SNACK_BAR_DATA);
}
