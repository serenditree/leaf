import {AboutModule} from '../about/about.module';
import {BotDndComponent} from './bot-dnd/bot-dnd.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FenceInterceptor} from './feature/fence.interceptor';
import {FenceService} from './service/fence.service';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
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
