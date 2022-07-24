import {CommonModule} from '@angular/common';
import {LayoutService} from './service/layout.service';
import {NgModule} from '@angular/core';

@NgModule(
    {
        imports: [
            CommonModule
        ],
        providers: [
            LayoutService
        ]
    }
)
export class LayoutModule {
}
