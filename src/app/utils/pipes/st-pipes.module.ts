import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {StEllipsisLinePipe} from './st-ellipsis-line.pipe';
import {StEllipsisPipe} from './st-ellipsis.pipe';
import {StGreetingPipe} from './st-greeting.pipe';
import {StHighlightPipe} from './st-highlight.pipe';
import {StHtmlPipe} from './st-html.pipe';
import {StRegexReplacePipe} from './st-regex-replace.pipe';
import {StTagsPipe} from './st-tags.pipe';

@NgModule(
    {
        imports: [
            CommonModule
        ],
        declarations: [
            StEllipsisPipe,
            StEllipsisLinePipe,
            StGreetingPipe,
            StHighlightPipe,
            StHtmlPipe,
            StRegexReplacePipe,
            StTagsPipe
        ],
        exports: [
            StEllipsisPipe,
            StEllipsisLinePipe,
            StGreetingPipe,
            StHighlightPipe,
            StHtmlPipe,
            StRegexReplacePipe,
            StTagsPipe
        ]
    }
)
export class StPipesModule {
}
