import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {FormsModule} from '@angular/forms';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search/search.component';
import {SearchService} from './service/search.service';
import {StDirectivesModule} from '../utils/directives/st-directives.module';
import {StPipesModule} from '../utils/pipes/st-pipes.module';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            MatAutocompleteModule,
            MatInputModule,
            ReactiveFormsModule,
            StDirectivesModule,
            StPipesModule,
            MatSlideToggleModule,
            MatRadioModule,
            MatButtonModule
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
