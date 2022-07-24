import {DomSanitizer} from '@angular/platform-browser';
import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'highlight'})
export class StHighlightPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(text: string, term: string): SafeHtml {
        if (text) {
            text = text
                .replace(
                    new RegExp(term, 'gi'),
                    (match) => `<span class="st-match">${match}</span>`
                );
        } else {
            text = '';
        }

        return this._sanitizer.bypassSecurityTrustHtml(text);

    }
}
