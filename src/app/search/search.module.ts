import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgModule} from '@angular/core';
import {SearchComponent} from './search/search.component';
import {SearchService} from './service/search.service';
import {StFocusDirective} from '../utils/directives/st-focus.directive';
import {StHighlightPipe} from '../utils/pipes/st-highlight.pipe';
import {StTagsPipe} from '../utils/pipes/st-tags.pipe';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            MatAutocompleteModule,
            MatInputModule,
            ReactiveFormsModule,
            StFocusDirective,
            MatSlideToggleModule,
            MatRadioModule,
            MatButtonModule,
            StHighlightPipe,
            StTagsPipe
        ],
        declarations: [
            SearchComponent,
            FilterComponent
        ],
        exports: [
            SearchComponent,
            FilterComponent
        ],
        providers: [
            SearchService
        ]
    }
)
export class SearchModule {
}
