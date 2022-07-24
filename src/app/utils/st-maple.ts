export class StMaple {

    /**
     * Maps the property values of an original object to a target object based on property keys/names.
     * @param {[key: string]: any} from Original object.
     * @param {T} to Target object.
     * @returns {T} Target object with property values from the original object.
     */
    public static map<T>(from: {[key: string]: any}, to: T): T {
        Object.keys(from).forEach((key) => {
            // eslint-disable-next-line no-prototype-builtins
            if (from.hasOwnProperty(key) && to.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        });

        return to;
    }

    /**
     * Joins url components and adds or removes slashes if needed.
     * @param urlComponents Variable number of url component arguments.
     * @return {string} Joined url.
     */
    public static joinUrl(...urlComponents: Array<string | number>): string {
        urlComponents = urlComponents.map((component) => {
            return component
                .toString()
                .replace(/^\/|\/$/g, '');
        });

        return urlComponents.join('/');
    }

    /**
     * Maps a value from a given number scale to a value between 0 and 10.
     * @param {number} min Start of original scale.
     * @param {number} max End of original scale.
     * @param {number} score Value that is to be mapped.
     * @returns {number} Value within the target scale 0:10
     */
    public static mapScore(min: number, max: number, score: number): number {
        return 10 * ((score - min) / (max - min));
    }

    /**
     * Maps a value from one number scale to another.
     * @param {number} min Start of original scale.
     * @param {number} max End of original scale.
     * @param {number} toMin Start of target scale.
     * @param {number} toMax End of target scale.
     * @param {number} score Value that is to be mapped.
     * @returns {number} Value within the target scale
     */
    public static mapScoreScale(min: number, max: number, toMin: number, toMax: number, score: number): number {
        return toMin + (toMax - toMin) * ((score - min) / (max - min));
    }
}
