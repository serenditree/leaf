import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'tags'})
export class StTagsPipe implements PipeTransform {

    transform(tags: string[]): string {
        let text = '';
        if (tags) {
            text = tags
                .map((tag) => `#${tag}`)
                .join(', ');
        }

        return text;
    }
}
