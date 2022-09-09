import {AboutComponent} from './about/about.component';
import {CommonModule} from '@angular/common';
import {ContactComponent} from './contact/contact.component';
import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {TermsComponent} from './terms/terms.component';

@NgModule(
    {
        declarations: [AboutComponent, TermsComponent, ContactComponent],
        imports: [CommonModule, MatIconModule],
        exports: [AboutComponent, TermsComponent, ContactComponent]
    }
)
export class AboutModule {
}
