import {PipeTransform} from '@angular/core';
import {Pipe} from '@angular/core';

@Pipe({name: 'greeting'})
export class StGreetingPipe implements PipeTransform {

    private readonly NOON = 0;
    private readonly MORNING = 11;
    private readonly EVENING = 18;

    public transform(name: string): string {
        let greeting: string;
        const now = new Date().getHours();

        if (now >= this.NOON && now < this.MORNING) {
            greeting = 'Good morning';
        } else if (now >= this.MORNING && now < this.EVENING) {
            greeting = 'Hi';
        } else {
            greeting = 'Good evening';
        }

        return `${greeting} ${name}`;
    }
}
