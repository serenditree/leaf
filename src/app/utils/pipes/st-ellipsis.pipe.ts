import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class StEllipsisPipe implements PipeTransform {

    transform(text: string, max: number): string {
        if (text) {
            if (text.length > max) {
                text = `${text.slice(0, max).trim()}<span class="st-ellipsis">...</span>`;
            }
        } else {
            text = '';
        }

        return text;
    }
}
