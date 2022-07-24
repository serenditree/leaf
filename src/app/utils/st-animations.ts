import {AnimationCurves} from '@angular/material/core';
import {AnimationDurations} from '@angular/material/core';
import {AnimationTriggerMetadata} from '@angular/animations';
import {animate} from '@angular/animations';
import {keyframes} from '@angular/animations';
import {query} from '@angular/animations';
import {stagger} from '@angular/animations';
import {state} from '@angular/animations';
import {style} from '@angular/animations';
import {transition} from '@angular/animations';
import {trigger} from '@angular/animations';

/**
 * Collection of reusable Angular animations.
 */
export class StAnimations {

    public static readonly STATE_ACTIVE = 'active';
    public static readonly STATE_INACTIVE = 'inactive';
    public static readonly COMPLEX = `${AnimationDurations.COMPLEX} ${AnimationCurves.DECELERATION_CURVE}`;
    public static readonly ENTERING = `${AnimationDurations.ENTERING} ${AnimationCurves.DECELERATION_CURVE}`;
    public static readonly LEAVING = `${AnimationDurations.EXITING} ${AnimationCurves.DECELERATION_CURVE}`;
    public static readonly COMPLEX_DURATION = parseInt(AnimationDurations.COMPLEX);
    public static readonly ENTERING_DURATION = parseInt(AnimationDurations.ENTERING);
    public static readonly LEAVING_DURATION = parseInt(AnimationDurations.EXITING);

    public static readonly slideVertical: AnimationTriggerMetadata = trigger(
        'slideVertical',
        [
            state(
                StAnimations.STATE_ACTIVE,
                style({height: '*'})
            ),
            state(
                StAnimations.STATE_INACTIVE,
                style({height: 0})
            ),
            transition(
                `${StAnimations.STATE_INACTIVE} <=> ${StAnimations.STATE_ACTIVE}`,
                animate(StAnimations.COMPLEX)
            )
        ]
    );

    public static readonly enterSlideVertical: AnimationTriggerMetadata = trigger(
        'enterSlideVertical',
        [
            state(
                '*',
                style({height: '*', overflow: 'hidden'})
            ),
            state(
                'void',
                style({height: 0, overflow: 'hidden'})
            ),
            transition(
                '* <=> void',
                animate(StAnimations.ENTERING)
            )
        ]
    );

    public static readonly enterSlideHorizontal: AnimationTriggerMetadata = trigger(
        'enterSlideHorizontal',
        [
            state(
                '*',
                style({width: '*', overflow: 'hidden'})
            ),
            state(
                'void',
                style({width: 0, overflow: 'hidden'})
            ),
            transition(
                '* <=> void',
                animate(StAnimations.ENTERING)
            )
        ]
    );

    public static readonly fabToggle: AnimationTriggerMetadata = trigger(
        'fabToggle',
        [
            transition(
                '* => *',
                [
                    query(
                        ':enter',
                        style({opacity: 0}),
                        {optional: true}
                    ),
                    query(
                        ':enter',
                        stagger(
                            '42ms',
                            [
                                animate(
                                    StAnimations.ENTERING,
                                    keyframes(
                                        [
                                            style({opacity: 0, transform: 'translateY(20px)'}),
                                            style({opacity: 1, transform: 'translateY(0)'})
                                        ]
                                    )
                                )
                            ]
                        ),
                        {optional: true}
                    )
                ]
            )
        ]
    );

    public static readonly enterFade: AnimationTriggerMetadata = trigger(
        'enterFade',
        [
            state(
                '*',
                style({opacity: 1})
            ),
            state(
                'void',
                style({opacity: 0})
            ),
            transition(
                '* <=> void',
                animate(StAnimations.COMPLEX)
            )
        ]
    );

    public static readonly fade = (to: number): AnimationTriggerMetadata => {
        return trigger(
            'fade',
            [
                state(
                    StAnimations.STATE_ACTIVE,
                    style({opacity: 1})
                ),
                state(
                    StAnimations.STATE_INACTIVE,
                    style({opacity: to})
                ),
                transition(
                    `${StAnimations.STATE_INACTIVE} <=> ${StAnimations.STATE_ACTIVE}`,
                    animate(StAnimations.COMPLEX)
                )
            ]
        );
    };
}
