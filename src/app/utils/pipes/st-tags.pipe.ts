import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'tags', standalone: false})
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
