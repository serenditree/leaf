import {SCROLL_TIME} from '../../../utils/st-const';
import {AbstractSeed} from '../../../seed/model/abstract-seed';
import {Directive} from '@angular/core';
import {ElementRef} from '@angular/core';
import {HostListener} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {ListEventService} from '../service/list-event.service';
import {ListEvent} from '../model/list-event';
import {MarkerEvent} from '../../../map/model/marker-event';
import {QueryList} from '@angular/core';

@Directive({selector: 'list'}) // no need to use it in a directive manner
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractList<T extends AbstractSeed> {

    protected _activeItemId: string;
    protected _items: T[];
    protected _itemElements: QueryList<ElementRef>;
    private _lastScrollTop = 0;
    private _scrollingToItem = false;

    protected constructor(protected _listEventService: ListEventService,
                          protected _layoutService: LayoutService) {
    }

    get activeItemId(): string {
        return this._activeItemId;
    }

    protected _handleUpdate(items: T[]): void {
        this._onUpdate(items);
        this._items = items;
        this._activeItemId = null;
        window.scroll({top: 0, behavior: 'smooth'});
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected _onUpdate(items: T[]): void {
        // extension hook
    }

    protected _handleMarkerEvent(marker: MarkerEvent): void {
        if (marker.id) {
            if (marker.scroll) {
                this._scrollToItem(marker.id);
                setTimeout(
                    () => {
                        // set after scroll has ended to make the activation-animation visible
                        this._activeItemId = marker.id;
                        this._scrollingToItem = false;
                    },
                    SCROLL_TIME + 420
                );
            } else {
                this._activeItemId = marker.id;
            }
        }
    }

    protected _scrollToItem(id: string): void {
        if (this._itemElements) {
            this._scrollingToItem = true;
            let itemIndex = 0;
            const itemElement = this._itemElements.find(
                (item, index) => {
                    itemIndex = index;
                    return item.nativeElement.id === id.toString();
                }
            );
            window.scroll(
                {
                    top: itemIndex === 0 ? 0 : Number(itemElement.nativeElement.offsetTop) + 42,
                    behavior: 'smooth'
                }
            );
        }
    }

    @HostListener('window:scroll', ['$event.target.scrollingElement'])
    private _onScroll(event: HTMLElement): void {
        if (this._layoutService.isMobile() && !this._scrollingToItem) {
            const top = event.scrollTop < 0 ? 0 : event.scrollTop;
            const delta = this._lastScrollTop - top; // + up / - down
            this._lastScrollTop = top;
            this._listEventService.fireListEvent(new ListEvent(top, delta));
        }
    }
}
