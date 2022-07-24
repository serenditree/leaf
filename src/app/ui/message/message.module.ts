import {CommonModule} from '@angular/common';
import {MessageService} from './service/message.service';
import {NgModule} from '@angular/core';

@NgModule(
    {
        declarations: [],
        imports: [
            CommonModule
        ],
        providers: [
            MessageService
        ]
    }
)
export class MessageModule {
}
