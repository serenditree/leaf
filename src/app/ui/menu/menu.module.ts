import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MenuBottomComponent} from './menu-bottom/menu-bottom.component';
import {MenuComponent} from './menu/menu.component';
import {MenuFabComponent} from './menu-fab/menu-fab.component';
import {MenuFabDialComponent} from './menu-fab-dial/menu-fab-dial.component';
import {MenuService} from './service/menu.service';
import {MenuSubComponent} from './menu-sub/menu-sub.component';
import {MenuTopComponent} from './menu-top/menu-top.component';
import {NavModule} from '../nav/nav.module';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SearchModule} from '../../search/search.module';

@NgModule(
    {
        imports: [
            BrowserAnimationsModule,
            BrowserModule,
            CommonModule,
            MatBottomSheetModule,
            MatButtonModule,
            MatIconModule,
            MatTooltipModule,
            NavModule,
            RouterModule,
            SearchModule
        ],
        declarations: [
            MenuBottomComponent,
            MenuComponent,
            MenuSubComponent,
            MenuTopComponent,
            MenuFabComponent,
            MenuFabDialComponent
        ],
        exports: [
            MenuBottomComponent,
            MenuComponent,
            MenuSubComponent,
            MenuTopComponent,
            MenuFabComponent,
            MenuFabDialComponent
        ],
        providers: [
            MenuService
        ]
    }
)
export class MenuModule {
}
