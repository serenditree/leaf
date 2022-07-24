import {Metadata} from 'aspect.js';
import {Wove} from 'aspect.js';
import {afterMethod} from 'aspect.js';
import {beforeMethod} from 'aspect.js';

export class StLogging {
    @beforeMethod(
        {
            classNamePattern: /.*/,
            methodNamePattern: /.*/
        }
    )
    beforeMethod(meta: Metadata): void {
        if (meta.woveMetadata &&
            meta.woveMetadata.logBefore &&
            (!meta.woveMetadata.exclude ||
             !meta.woveMetadata.exclude.test(meta.method.name))) {
            let args = '';
            if (meta.method.args.length) {
                args = ` with args: ${meta.method.args.join(', ')}`;
            }
            console.log(`Called ${meta.className}.${meta.method.name}${args}`);
        }
    }

    @afterMethod(
        {
            classNamePattern: /.*/,
            methodNamePattern: /.*/
        }
    )
    afterMethod(meta: Metadata): void {
        if (meta.woveMetadata &&
            meta.woveMetadata.logAfter &&
            (!meta.woveMetadata.exclude ||
             !meta.woveMetadata.exclude.test(meta.method.name))) {
            console.log(`Returned from ${meta.className}.${meta.method.name}`);
        }
    }
}

export const StLoggingAspect = Wove;
export const StLoggingDefaultConfig = {
    logBefore: true,
    logAfter: true
};
