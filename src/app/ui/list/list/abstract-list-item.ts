import {AbstractSeed} from '../../../seed/model/abstract-seed';
import {Directive} from '@angular/core';
import {HostListener} from '@angular/core';
import {Input} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {ListEventService} from '../service/list-event.service';
import {ListItemEvent} from '../model/list-item-event';

@Directive({selector: 'listItem'}) // no need to use it in a directive manner
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractListItem<T extends AbstractSeed> {

    private _active = false;
    private _maxWords = 128;
    private _maxLines = 4;

    protected _seed: T;

    protected constructor(protected _layoutService: LayoutService,
                          protected _listEventService: ListEventService) {
        if (this._layoutService.isMobile()) {
            this._maxWords = 64;
        }
    }

    get active(): boolean {
        return this._active;
    }

    get maxWords(): number {
        return this._maxWords;
    }

    get maxLines(): number {
        return this._maxLines;
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
