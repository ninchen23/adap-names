import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertCorrectAdd(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertCorrectRemove(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }


    // Methods for assertion
    protected assertCorrectAdd(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(!this.childNodes.has(cn), "Node already in childNodes");
    }

    protected assertCorrectRemove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Node does not exist in childNodes");
    }

}