import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class StEllipsisPipe implements PipeTransform {
    transform(text: string, maxWords = 128, maxLines = 4): string {
        if (text) {
            let abbreviated = false;
            text = text
                .replaceAll(/(\r\n)|\r/g, '\n')
                .replaceAll(/\n{3,}/g, '\n\n')
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
                text = text.replace(/\.+$/, '') + '...';
            }
        } else {
            text = '';
        }

        return text;
    }
}
