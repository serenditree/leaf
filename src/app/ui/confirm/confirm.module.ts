import {CommonModule} from '@angular/common';
import {ConfirmComponent} from './confirm/confirm.component';
import {MatButtonModule} from '@angular/material/button';
import {NgModule} from '@angular/core';

@NgModule(
    {
        imports: [
            CommonModule,
            MatButtonModule
        ],
        declarations: [ConfirmComponent],
        exports: [ConfirmComponent]
    }
)
export class ConfirmModule {
}
