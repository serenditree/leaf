import {AbstractSeed} from './abstract-seed';
import {Poll} from '../../poll/model/poll';

export class Seed extends AbstractSeed {
    public poll: boolean;
    public polls: Poll[];
    public gardenId: string;
    public trail: boolean;
    public trailId: string;
    public localAlignment: number;
}
