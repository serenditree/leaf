import {AbstractSeed} from '../../../seed/model/abstract-seed';
import {Directive} from '@angular/core';
import {HostListener} from '@angular/core';
import {Input} from '@angular/core';
import {ListEventService} from '../service/list-event.service';
import {ListItemEvent} from '../model/list-item-event';

@Directive({selector: 'listItem'}) // no need to use it in a directive manner
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractListItem<T extends AbstractSeed> {

    public readonly ST_PREVIEW_LENGTH = 500;

    private _active = false;

    protected _seed: T;

    protected constructor(protected _listEventService: ListEventService) {
    }

    get active(): boolean {
        return this._active;
    }

    @Input()
    set active(value: boolean) {
        this._active = value;
    }

    @HostListener('click')
    public onClick(): void {
        this._listEventService.fireListItemEvent(new ListItemEvent(this._seed.id, true));
    }

    @HostListener('mouseover')
    public onMouseOver(): void {
        this._listEventService.fireListItemEvent(new ListItemEvent(this._seed.id, false));
    }
}
