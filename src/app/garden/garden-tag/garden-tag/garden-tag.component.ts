import {Component} from '@angular/core';
import {GardenTagPrintComponent} from '../garden-tag-print/garden-tag-print.component';
import {Garden} from '../../model/garden';
import {HostBinding} from '@angular/core';
import {HostListener} from '@angular/core';
import {Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component(
    {
        selector: 'st-garden-tag',
        templateUrl: './garden-tag.component.html',
        styleUrls: ['./garden-tag.component.scss']
    }
)
export class GardenTagComponent implements OnInit {

    private static readonly TAG_FOREGROUND_ACTIVE = '#000';
    private static readonly TAG_FOREGROUND_INACTIVE = '#666';

    private _garden: Garden;
    private _size: number;
    private _color = GardenTagComponent.TAG_FOREGROUND_INACTIVE;
    private _clickable = true;

    @HostListener('click')
    private _clickListener = this._onClick;

    @HostListener('mouseover')
    private _mouseOverListener = this._onMouseOver;

    @HostListener('mouseout')
    private _mouseOutListener = this._onMouseOut;

    @HostBinding('class.no-hover')
    private _noHover = false;

    constructor(private _gardenTagPrintDialog: MatDialog) {
    }

    @Input()
    set garden(value: Garden) {
        this._garden = value;
    }

    get data(): string {
        return `https://${environment.HOSTNAME}/gardens/${this._garden.id}`;
    }

    @Input()
    set size(value: number) {
        this._size = value;
    }

    get size(): number {
        return this._size;
    }

    @Input()
    set color(value: string) {
        this._color = value;
    }

    get color(): string {
        return this._color;
    }

    @Input()
    set clickable(value: boolean) {
        this._clickable = value;
    }

    ngOnInit(): void {

        if (!this._clickable) {
            this._noHover = true;
        }
    }

    private _onClick(): void {
        if (this._clickable) {
            this._gardenTagPrintDialog.open(
                GardenTagPrintComponent,
                {data: this._garden}
            );
        }
    }

    private _onMouseOver(): void {
        if (this._clickable) {
            this._color = GardenTagComponent.TAG_FOREGROUND_ACTIVE;
        }
    }

    private _onMouseOut(): void {
        if (this._clickable) {
            this._color = GardenTagComponent.TAG_FOREGROUND_INACTIVE
        }
    }
}
