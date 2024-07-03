export class StUtils {

    /**
     * Checks if a given node is a child of other nodes.
     * @param child Child node.
     * @param parentIds IDs of nodes to check.
     */
    public static isChildNode(child: HTMLElement, ...parentIds: string[]): boolean {
        let isChild = false;
        for (let element = child; !isChild && element; element = element.parentElement) {
            if (parentIds.includes(element.id)) {
                isChild = true;
            }
        }

        return isChild;
    }
}
