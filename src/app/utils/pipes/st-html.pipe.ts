import {DomSanitizer} from '@angular/platform-browser';
import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'html'})
export class StHtmlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(text: string): SafeHtml {
        if (text) {
            text = text
                // linebreaks
                .replace(/\n/g, '<br>')
                // hyperlinks
                .replace(
                    /((https?:)|(www.))(\S+)/g,
                    (match: string, g0: string, g1: string, g2: string, g3: string) =>
                        `<a class="underline" target="_blank" href="${g1 || 'https://'}${g2 || ''}${g3}">${match}</a>`
                );
        } else {
            text = '';
        }

        return this._sanitizer.bypassSecurityTrustHtml(text);
    }
}
