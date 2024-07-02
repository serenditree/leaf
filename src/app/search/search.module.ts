import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
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
