import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {Component} from '@angular/core';
import {Inject} from '@angular/core';
import {MatSnackBarConfig} from '@angular/material/snack-bar';

@Component(
    {
        selector: 'st-message-component',
        templateUrl: './message.component.html',
        styleUrls: ['./message.component.scss']
    }
)
export class MessageComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: MatSnackBarConfig) {
    }
}
