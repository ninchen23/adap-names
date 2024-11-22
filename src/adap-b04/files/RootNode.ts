import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        this.assertCorrectMove(to);
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        this.assertCorrectSetBaseName(bn);
        // null operation
    }


    // Methods for assertion
    protected assertCorrectMove(to: Directory): void {
        IllegalArgumentException.assertCondition(false, "Cannot move root node");
    }

    protected assertCorrectSetBaseName(bn: string): void {
        IllegalArgumentException.assertCondition(false, "Cannot set base name of root node");
    }

}