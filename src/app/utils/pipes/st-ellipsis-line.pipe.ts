import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ellipsisLine', standalone: false})
export class StEllipsisLinePipe implements PipeTransform {
    transform(value: string, maxLength: number): string {

        return (!value || maxLength <= 0) ? value : value.split('\n')
            .map(line => line.length > maxLength ? `${line.slice(0, maxLength).trimEnd()}...` : line)
            .join('\n');
    }
}
