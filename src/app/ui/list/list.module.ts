import {CommonModule} from '@angular/common';
import {ListEventService} from './service/list-event.service';
import {NgModule} from '@angular/core';

@NgModule(
    {
        declarations: [],
        imports: [CommonModule],
        providers: [ListEventService]
    }
)
export class ListModule {
}
