import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {IsActiveMatchOptions} from '@angular/router';

@Component(
    {
        selector: 'st-nav-item',
        templateUrl: './nav-item.component.html',
        styleUrls: ['./nav-item.component.scss']
    }
)
export class NavItemComponent {
    private _text: string;
    private _textUnderline: false;
    private _set = 'fa';
    private _icon: string;
    private _iconClassList: string[];
    private _routerLink: string;
    private _routerLinkActiveOptions: {exact: boolean} | IsActiveMatchOptions = {exact: true};
    private _disabled = false;
    private _active: boolean;
    private _fab: boolean;

    get text(): string {
        return this._text;
    }

    @Input()
    set text(value: string) {
        this._text = value;
    }

    get textUnderline(): false {
        return this._textUnderline;
    }

    @Input()
    set textUnderline(value: false) {
        this._textUnderline = value;
    }

    get set(): string {
        return this._set;
    }

    @Input()
    set set(value: string) {
        this._set = value;
    }

    get icon(): string {
        return this._icon;
    }

    @Input()
    set icon(value: string) {
        this._icon = value;
    }

    get iconClassList(): string[] {
        return this._iconClassList;
    }

    @Input()
    set iconClassList(value: string[]) {
        this._iconClassList = value;
    }

    get routerLink(): string {
        return this._routerLink;
    }

    @Input()
    set routerLink(value: string) {
        this._routerLink = value;
    }

    get routerLinkActiveOptions(): {exact: boolean}  | IsActiveMatchOptions {
        return this._routerLinkActiveOptions;
    }

    @Input()
    set routerLinkActiveOptions(value: {exact: boolean}  | IsActiveMatchOptions) {
        this._routerLinkActiveOptions = value;
    }

    get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    set disabled(value: boolean) {
        this._disabled = value;
    }

    get active(): boolean {
        return this._active;
    }

    @Input()
    set active(value: boolean) {
        this._active = value;
    }

    get fab(): boolean {
        return this._fab;
    }

    @Input()
    set fab(value: boolean) {
        this._fab = value;
    }
}
