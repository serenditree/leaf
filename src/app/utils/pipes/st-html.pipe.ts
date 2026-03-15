import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pipe, PipeTransform, inject} from '@angular/core';

@Pipe({name: 'html', standalone: false})
export class StHtmlPipe implements PipeTransform {
    private _sanitizer = inject(DomSanitizer);


    transform(text: string): SafeHtml {
        if (text) {
            text = text
                // linebreaks
                .replace(/\n/g, '<br>')
                // hyperlinks
                .replace(
                    /((https?:)|(www.))(\S+)/g,
                    (match: string, g0: string, g1: string, g2: string, g3: string) =>
                        `<a class="st-underline" target="_blank" href="${g1 || 'https://'}${g2 ||
                                                                                            ''}${g3}">${match}</a>`
                );
        } else {
            text = '';
        }

        return this._sanitizer.bypassSecurityTrustHtml(text);
    }
}
