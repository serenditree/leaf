import {AboutModule} from '../about/about.module';
import {BotDndComponent} from './bot-dnd/bot-dnd.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FenceInterceptor} from './feature/fence.interceptor';
import {FenceService} from './service/fence.service';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {provideHttpClient} from '@angular/common/http';
import {withInterceptorsFromDi} from '@angular/common/http';

@NgModule(
    { declarations: [SignInComponent, SignUpComponent, BotDndComponent],
    exports: [SignInComponent, SignUpComponent, BotDndComponent], imports: [CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterModule,
        DragDropModule,
        MatCheckboxModule,
        AboutModule], providers: [FenceService, FenceInterceptor, provideHttpClient(withInterceptorsFromDi())] }
)
export class FenceModule {
}
