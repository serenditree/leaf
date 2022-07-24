import {AbstractSeed} from './abstract-seed';
import {Poll} from '../../poll/model/poll';

export class Seed extends AbstractSeed {
    public localAlignment: number;
    public trail: boolean;
    public garden: string;
    public poll: boolean;
    public polls: Poll[];
}
