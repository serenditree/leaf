import {MAT_SNACK_BAR_DATA, MatSnackBarConfig} from '@angular/material/snack-bar';
import {Component, inject} from '@angular/core';

@Component(
    {
        selector: 'st-message-component',
        templateUrl: './message.component.html',
        styleUrls: ['./message.component.scss'],
        standalone: false
    }
)
export class MessageComponent {
    data = inject<MatSnackBarConfig>(MAT_SNACK_BAR_DATA);
}
