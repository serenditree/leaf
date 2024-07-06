import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Output} from '@angular/core';
import {moveItemInArray} from '@angular/cdk/drag-drop';

@Component(
    {
        selector: 'st-dnd',
        templateUrl: './bot-dnd.component.html',
        styleUrls: ['./bot-dnd.component.scss']
    }
)
export class BotDndComponent {

    private _onTuring = new EventEmitter<boolean>();
    private _words = [
        'am',
        'I',
        'human'
    ];

    @Output()
    get onTuring(): EventEmitter<boolean> {
        return this._onTuring;
    }

    get words(): string[] {
        return this._words;
    }

    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this._words, event.previousIndex, event.currentIndex);
        if (this._words.join(' ') === 'I am human') {
            this._onTuring.emit(true);
        } else {
            this._onTuring.emit(false);
        }
    }
}
