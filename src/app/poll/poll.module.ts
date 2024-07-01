import {ChartComponent} from './chart/chart.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
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
