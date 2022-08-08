import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class StEllipsisPipe implements PipeTransform {

    private static readonly ELLIPSIS = '<b>&hellip;</b>';

    transform(text: string, maxWords = 128, maxLines = 4): string {
        if (text) {
            text = text.replace(/(\r\n)|\r/g, '\n').trim();
            if (text.split(/\n/).length > maxLines || text.split(/ +/).length > maxWords) {
                text = text.replace(/\n{3,}/g, '\n\n')
                           .split(/\n/)
                           .slice(0, maxLines)
                           .reduce((prev, curr) => `${prev}\n${curr}`)
                           .split(/ +/)
                           .slice(0, maxWords)
                           .reduce((prev, curr) => `${prev} ${curr}`)
                           .trim()
                           .replace(/\.+$/, '') + StEllipsisPipe.ELLIPSIS;
            }
        } else {
            text = '';
        }

        return text;
    }
}
