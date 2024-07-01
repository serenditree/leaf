import {AboutModule} from '../about/about.module';
import {BotDndComponent} from './bot-dnd/bot-dnd.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FenceInterceptor} from './feature/fence.interceptor';
import {FenceService} from './service/fence.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
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

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            HttpClientModule,
            MatButtonModule,
            MatIconModule,
            MatInputModule,
            MatSnackBarModule,
            ReactiveFormsModule,
            RouterModule,
            DragDropModule,
            MatCheckboxModule,
            AboutModule
        ],
        declarations: [SignInComponent, SignUpComponent, BotDndComponent],
        providers: [FenceService, FenceInterceptor],
        exports: [SignInComponent, SignUpComponent, BotDndComponent]
    }
)
export class FenceModule {
}
