import {CommonModule} from '@angular/common';
import {MessageComponent} from './message/message.component';
import {MessageService} from './service/message.service';
import {NgModule} from '@angular/core';

@NgModule(
    {
        declarations: [
            MessageComponent
        ],
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
