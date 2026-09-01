import {CommonModule} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgModule} from '@angular/core';
import {ToggleComponent} from './toggle/toggle.component';

@NgModule(
    {
        imports: [
            CommonModule,
            MatSlideToggleModule
        ],
        declarations: [
            ToggleComponent
        ],
        exports: [
            ToggleComponent
        ]
    }
)
export class ToggleModule {
}
