import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "other in constructor of StringName cannot be null or undefined");

        super(delimiter);
        this.components = [...other];

        this.assertCorrectState(other, delimiter);
    }

    protected assertStringArrayNameInvariants() {
        super.assertAbstractNameInvariants();
        InvalidStateException.assertNotNullOrUndefined(this.components, "this.components is null or undefined");
        this.assertValidComponents();
    }

    // public clone(): Name {
    //     throw new Error("needs implementation");
    // }

    // public asString(delimiter: string = this.delimiter): string {
    //     throw new Error("needs implementation");
    // }

    // public toString(): string {
    //     throw new Error("needs implementation");
    // }

    // public asDataString(): string {
    //     throw new Error("needs implementation");
    // }

    // public isEqual(other: Name): boolean {
    //     throw new Error("needs implementation");
    // }

    // public getHashCode(): number {
    //     throw new Error("needs implementation");
    // }

    // public isEmpty(): boolean {
    //     throw new Error("needs implementation");
    // }

    // public getDelimiterCharacter(): string {
    //     throw new Error("needs implementation");
    // }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);

        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(c, "component to set cannot be null or undefined");
        const original = [...this.components];

        this.components[i] = c;

        this.assertIsNullOrUndefined(this, original);
        this.assertSetComponent(c, i, original);
    }

    public insert(i: number, c: string) {
        this.assertValidIndex(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(c, "component to insert cannot be null or undefined");
        const original = [...this.components];

        this.components.splice(i, 0, c);

        this.assertIsNullOrUndefined(this, original);
        this.assertInsertComponent(c, i, original);
    }

    public append(c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c, "component to append cannot be null or undefined");
        const original = [...this.components];

        this.components.push(c);

        this.assertIsNullOrUndefined(this, original);
        this.assertAppendComponent(c, original);
    }

    public remove(i: number) {
        this.assertValidIndex(i);
        const original = [...this.components];

        this.components.splice(i, 1);

        this.assertIsNullOrUndefined(this, original);
        this.assertRemovedComponent(i, original);
    }

    // public concat(other: Name): void {
    //     throw new Error("needs implementation");
    // }


    // methods for assertions for post-conditions
    protected assertCorrectState(components: string[], delimiter: string | undefined): void {
        const cond = JSON.stringify(components) === JSON.stringify(this.components);
        MethodFailureException.assertCondition(cond, "StringArrayName not correctly consructed");
    }

    private restore(original: string[]) {
        this.components = original;
    }

    protected assertIsNullOrUndefined(o: Object | null, original: string[]): void {
        if (o === null || o === undefined) {
            this.restore(original);
            MethodFailureException.assertCondition(false, "null or undefined");
        }
    }

    protected assertSetComponent(c: string, index: number, original: string[]): void {
        if (original.length !== this.components.length) {
            this.restore(original);
            MethodFailureException.assertCondition(false, `component was not set correctly`);
        }

        let cond = true;
        for (let i = 0; i < original.length; i++) {
            if(this.components[i] !== original[i]) {
                if (i === index) {
                    if (this.components[i] !== c) {
                        cond = false;
                    }
                } else {
                    cond = false;
                }
                
                if (cond === false) {
                    this.restore(original);
                    MethodFailureException.assertCondition(cond, `component was not set correctly`);
                }
            }
        }
    }

    protected assertInsertComponent(c: string, index: number, original: string[]): void {
        if (original.length !== this.components.length - 1) {
            this.restore(original);
            MethodFailureException.assertCondition(false, `component was not inserted`);
        }

        let cond = true;
        let i_new = 0;
        for (let i_orig = 0; i_orig < original.length; i_orig++) {
            if (i_orig === index) {
                if(this.components[i_new] !== c) {
                    cond = false;
                    this.restore(original);
                    MethodFailureException.assertCondition(cond, `component was not inserted`);
                }
                i_new++;
            }
            if(this.components[i_new] !== original[i_orig]) {
                cond = false;
                this.restore(original);
                MethodFailureException.assertCondition(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    protected assertAppendComponent(c: string, original: string[]): void {
        if (original.length !== this.components.length - 1) {
            this.restore(original);
            MethodFailureException.assertCondition(false, `component was not appended`);
        }

        let cond = true;
        for (let i = 0; i < original.length; i++) {
            if(this.components[i] !== original[i]) {
                cond = false;
                this.restore(original);
                MethodFailureException.assertCondition(cond, `component was not appended`);
            }
        }
        if (this.components[original.length] !== c) {
            cond = false;
            this.restore(original);
            MethodFailureException.assertCondition(cond, `component was not appended`);
        }
    }

    protected assertRemovedComponent(index: number, original: string[]): void {
        if (original.length !== this.components.length + 1) {
            this.restore(original);
            MethodFailureException.assertCondition(false, `component was not removed`);
        }

        let cond = true;
        let i_new = 0;
        for (let i_orig = 0; i_orig < original.length; i_orig++) {
            if (i_orig === index) {
                i_orig++;
            }
            if(this.components[i_new] !== original[i_orig]) {
                cond = false;
                this.restore(original);
                MethodFailureException.assertCondition(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    // methods for assertions for class invariants
    protected assertValidComponents(): void {
        this.components.forEach(c => {
            InvalidStateException.assertNotNullOrUndefined(c, "at least one of the components is null or undefined");
        });
    }


}