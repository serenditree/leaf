import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pipe, PipeTransform, inject, SecurityContext} from '@angular/core';

@Pipe({name: 'highlight'})
export class StHighlightPipe implements PipeTransform {
    private readonly _sanitizer = inject(DomSanitizer);

    transform(text: string, term: string): SafeHtml {
        console.log(text, term);
        if (text) {
            text = (this._sanitizer
                .sanitize(SecurityContext.HTML, text) ?? '')
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
