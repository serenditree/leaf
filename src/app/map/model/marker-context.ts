import {MarkerType} from './marker-type.enum';
import {NavigationExtras} from '@angular/router';

export class MarkerContext {
    public type: MarkerType;
    public update = false;
    public persistent = false;
    public fromList = false;
    public from: NavigationExtras;
}
