import {ChartComponent} from './chart/chart.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgModule} from '@angular/core';
import {PollNewComponent} from './poll-new/poll-new.component';
import {PollService} from './service/poll.service';
import {ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {withInterceptorsFromDi} from '@angular/common/http';

@NgModule(
    { declarations: [
        ChartComponent,
        PollNewComponent
    ],
    exports: [
        ChartComponent,
        PollNewComponent
    ], imports: [CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatTooltipModule,
        ReactiveFormsModule], providers: [
        PollService,
        provideHttpClient(withInterceptorsFromDi())
    ] }
)
export class PollModule {
}
