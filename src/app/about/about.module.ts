import {AboutComponent} from './about/about.component';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {TermsComponent} from './terms/terms.component';

@NgModule(
    {
        declarations: [AboutComponent, TermsComponent],
        imports: [CommonModule, MatIconModule],
        exports: [AboutComponent, TermsComponent]
    }
)
export class AboutModule {
}
