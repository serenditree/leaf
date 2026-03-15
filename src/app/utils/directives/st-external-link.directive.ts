import {Directive, HostBinding, Input} from '@angular/core';

@Directive({selector: 'a[target="_blank"]'})
export class StExternalLinkDirective {
    @HostBinding('attr.rel')
    @Input() rel = 'noopener noreferrer nofollow';
}
