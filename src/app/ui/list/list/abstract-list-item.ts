import {AbstractSeed} from '../../../seed/model/abstract-seed';
import {Directive, HostListener, Input} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {ListEventService} from '../service/list-event.service';
import {ListItemEvent} from '../model/list-item-event';

@Directive()
export abstract class AbstractListItem<T extends AbstractSeed> {

    private _active = false;
    private readonly _maxLines = 4;
    private _maxWords = 128;

    protected _seed!: T;

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

    @HostListener('click', ['$event'])
    public onClick(event: Event): void {
        if (!(event.target as HTMLElement).classList.contains('drop-item-event')) {
            this._listEventService.fireListItemEvent(new ListItemEvent(this._seed.id, true));
        }
    }

    @HostListener('mouseover')
    public onMouseOver(): void {
        this._listEventService.fireListItemEvent(new ListItemEvent(this._seed.id, false));
    }
}
