import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pipe, PipeTransform, inject} from '@angular/core';

@Pipe({name: 'highlight', standalone: false})
export class StHighlightPipe implements PipeTransform {
    private _sanitizer = inject(DomSanitizer);


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
