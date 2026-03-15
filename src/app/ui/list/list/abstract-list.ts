import {SCROLL_TIME} from '../../../utils/st-const';
import {AbstractSeed} from '../../../seed/model/abstract-seed';
import {ElementRef, QueryList, OnInit, Directive, inject, HostListener} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {MarkerEvent} from '../../../map/model/marker-event';

@Directive()
export abstract class AbstractList<T extends AbstractSeed> implements OnInit {

    protected _layoutService = inject(LayoutService);
    protected _activeItemId: string;
    protected _items: T[];
    protected _itemElements: QueryList<ElementRef>;

    private _offset: number;

    ngOnInit(): void {
        this._onInitAndWindowResize();
    }

    get activeItemId(): string {
        return this._activeItemId;
    }

    protected _handleUpdate(items: T[]): void {
        this._onUpdate(items);
        this._items = items;
        this._activeItemId = null;
        window.scroll(
            {
                top: 0,
                behavior: 'smooth'
            }
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            let itemIndex = 0;
            const itemElement = this._itemElements.find(
                (item, index) => {
                    itemIndex = index;
                    return item.nativeElement.id === id;
                }
            );
            window.scroll(
                {
                    top: itemIndex === 0 ? 0 : itemElement.nativeElement.offsetTop + this._offset,
                    behavior: 'smooth'
                }
            );
        }
    }

    @HostListener('window:resize', [])
    private _onInitAndWindowResize(): void {
        if (this._layoutService.isMobile()) {
            this._offset = -10;
        } else {
            this._offset = 60;
        }
    }
}
