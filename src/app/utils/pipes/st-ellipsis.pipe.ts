import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class StEllipsisPipe implements PipeTransform {

    private static readonly ELLIPSIS = '<b>&hellip;</b>';

    transform(text: string, maxWords = 128, maxLines = 4): string {
        if (text) {
            let abbreviated = false;
            text = text
                .replace(/(\r\n)|\r/g, '\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            const lines = text.split(/\n/);
            if (lines.length > maxLines) {
                abbreviated = true;
                text = lines
                    .slice(0, maxLines)
                    .reduce((prev, curr) => `${prev}\n${curr}`)
                    .trim();
            }

            const words = text.split(/ +/);
            if (words.length > maxWords) {
                abbreviated = true;
                text = words
                    .slice(0, maxWords)
                    .reduce((prev, curr) => `${prev} ${curr}`)
                    .trim();
            }

            if (abbreviated) {
                text = text.replace(/\.+$/, '') + StEllipsisPipe.ELLIPSIS;
            }
        } else {
            text = '';
        }

        return text;
    }
}
