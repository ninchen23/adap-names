import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.assertCorrectSetTargetNode(target);
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        super.assertCorrectRename(bn);
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        this.assertCorrectEnsureTargetNode(target);
        const result: Node = this.targetNode as Node;
        return result;
    }


    // Methods for assertion
    protected assertCorrectSetTargetNode(target: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(target);
    }

    protected assertCorrectEnsureTargetNode(target: Node | null): void {
        IllegalArgumentException.assertCondition(target !== undefined, "Link target node is undefined");
    }
}