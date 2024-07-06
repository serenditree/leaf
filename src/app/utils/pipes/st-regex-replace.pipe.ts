import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'regex'})
export class StRegexReplacePipe implements PipeTransform {

    transform(string: string,
              pattern: string,
              replacement: string,
              modifier = ''): string {

        return string.replace(new RegExp(pattern, modifier), replacement);
    }
}
