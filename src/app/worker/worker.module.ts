import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {UpdateService} from './service/update.service';

@NgModule(
    {
        declarations: [],
        imports: [
            CommonModule
        ],
        providers: [
            UpdateService
        ]
    }
)
export class WorkerModule {
}
