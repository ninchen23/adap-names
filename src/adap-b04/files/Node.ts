import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertCorrectNodeConstructor(bn, pn);
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.assertCorrectMove(to);
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertCorrectRename(bn);
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.assertCorrectSetBaseName(bn);
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }


    // Methods for assertion
    protected assertCorrectNodeConstructor(bn: string, pn: Directory): void {
        this.assertCorrectBaseName(bn);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
    }

    protected assertCorrectMove(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to);
    }

    protected assertCorrectRename(bn: string): void {
        this.assertCorrectBaseName(bn);
    }

    protected assertCorrectBaseName(bn: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertCondition(bn.length > 0, "Base name must be non-empty");
    }

    protected assertCorrectSetBaseName(bn: string): void {
        this.assertCorrectBaseName(bn);
    }

}
