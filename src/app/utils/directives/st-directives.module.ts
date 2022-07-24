import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {StFocusDirective} from './st-focus.directive';

@NgModule(
    {
        imports: [
            CommonModule
        ],
        declarations: [
            StFocusDirective
        ],
        exports: [
            StFocusDirective
        ]
    }
)
export class StDirectivesModule {
}
