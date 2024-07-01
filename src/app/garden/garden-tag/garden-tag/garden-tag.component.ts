import * as GardenTag from 'qrious';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {GardenTagPrintComponent} from '../garden-tag-print/garden-tag-print.component';
import {Garden} from '../../model/garden';
import {HostBinding} from '@angular/core';
import {HostListener} from '@angular/core';
import {Input} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';

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
    private _gardenTag: GardenTag;
    private _size: number;
    private _clickable = true;

    @ViewChild('tagCanvas', {static: true})
    private _tagCanvas: ElementRef;

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

    @Input()
    set size(value: number) {
        this._size = value;
    }

    @Input()
    set clickable(value: boolean) {
        this._clickable = value;
    }

    ngOnInit(): void {
        this._gardenTag = new GardenTag(
            {
                element: this._tagCanvas.nativeElement,
                foreground: this._clickable ?
                    GardenTagComponent.TAG_FOREGROUND_INACTIVE :
                    GardenTagComponent.TAG_FOREGROUND_ACTIVE,
                size: this._size,
                value: `https://serenditree.io/gardens/${this._garden.id}`
            }
        );
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
            this._gardenTag.foreground = GardenTagComponent.TAG_FOREGROUND_ACTIVE;
        }
    }

    private _onMouseOut(): void {
        if (this._clickable) {
            this._gardenTag.foreground = GardenTagComponent.TAG_FOREGROUND_INACTIVE;
        }
    }
}
