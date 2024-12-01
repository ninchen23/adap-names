import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";


import { Name } from "../names/Name";
import { Directory } from "./Directory";

// should'nt this be abstract?
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
        this.parentNode.add(this);
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

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            this.assertClassInvariants();

            this.assertCorrectBaseName(bn);
            const result: Set<Node> = new Set<Node>();
            if (this.getBaseName() === bn) {
                result.add(this);
            }
        
            this.assertClassInvariants();

            return result
        } catch(er) {
            ServiceFailureException.assertCondition(false, "service of findNodes failed", er as Exception);
            AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT, false, "service of findNodes failed");
        }
        return new Set<Node>();
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
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
