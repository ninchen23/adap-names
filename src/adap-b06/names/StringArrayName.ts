import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];
    protected originalComponents: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        this.assertCorrectParamComponents(source);

        this.components = [...source];
        this.originalComponents = [...source];

        this.assertCorrectState(source, delimiter);
    }

    protected assertStringArrayNameInvariants() {
        super.assertAbstractNameInvariants();
        this.assertIsNotUndefined(this.components, "this.components is undefined", true);
        this.assertValidComponents();
    }

    public getNoComponents(): number {
        this.assertStringArrayNameInvariants();
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        this.assertStringArrayNameInvariants();

        return this.components[i];
    }

    public setComponent(i: number, c: string): StringArrayName {
        this.assertCorrectParamsIndexComponent(i, c);
        this.assertStringArrayNameInvariants();
        const original = [...this.components];

        const newComponents = [...this.components];
        newComponents[i] = c;
        const newStringArrayName = new StringArrayName(newComponents, this.delimiter);

        newStringArrayName.assertSetComponent(c, i, original);
        this.assertStringArrayNameInvariants();
        return newStringArrayName;
    }

    public insert(i: number, c: string): StringArrayName {
        this.assertCorrectParamsIndexComponent(i, c);
        this.assertStringArrayNameInvariants();
        const original = [...this.components];

        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        const newStringArrayName = new StringArrayName(newComponents, this.delimiter);

        newStringArrayName.assertInsertComponent(c, i, original);
        this.assertStringArrayNameInvariants();
        return newStringArrayName;
    }

    public append(c: string): StringArrayName {
        this.assertCorrectParamComponent(c);
        this.assertStringArrayNameInvariants();
        const original = [...this.components];

        const newComponents = [...this.components];
        newComponents.push(c);
        const newStringArrayName = new StringArrayName(newComponents, this.delimiter);

        newStringArrayName.assertAppendComponent(c, original);
        this.assertStringArrayNameInvariants();
        return newStringArrayName;
    }

    public remove(i: number): StringArrayName {
        this.assertValidIndex(i);
        this.assertStringArrayNameInvariants();
        const original = [...this.components];

        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        const newStringArrayName = new StringArrayName(newComponents, this.delimiter);

        newStringArrayName.assertRemovedComponent(i, original);
        this.assertStringArrayNameInvariants();
        return newStringArrayName;
    }

    public concat(other: Name): Name {
        this.assertParameterNotUndefined(other, "other in concat cannot be undefined");
        this.assertStringArrayNameInvariants();
        // save original in case of failure of the post-condition
        const original = [...this.components];

        const newComponents = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            newComponents.push(other.getComponent(i));
        }
        const newStringArrayName = new StringArrayName(newComponents, this.delimiter);

        newStringArrayName.assertConcatComponents(this, other);
        this.assertStringArrayNameInvariants();
        return newStringArrayName;
    }



    

    // methods for assertions for pre-conditions
    protected assertCorrectParamComponents(components: string[]): void {
        this.assertIsNotUndefined(components, "components null or undefined");
        for(let i = 0; i < components.length; i++) {
            this.assertIsNotUndefined(components[i], `component at index ${i} is null or undefined`);
        }
    }

    protected assertCorrectParamComponent(c: string): void {
        this.assertIsNotUndefined(c, "component null or undefined");
    }

    protected assertCorrectParamsIndexComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        this.assertCorrectParamComponent(c);
    }


    // methods for assertions for post-conditions
    protected assertCorrectState(components: string[], delimiter: string | undefined): void {
        const cond = JSON.stringify(components) === JSON.stringify(this.components);
        MethodFailedException.assert(cond, "StringArrayName not correctly consructed");
    }

    // private restoreStringArrayName(original: string[]) {
    //     this.components = original;
    // }

    protected assertSetComponent(c: string, index: number, originalComponents: string[]): void {
        if (originalComponents.length !== this.components.length) {
            //this.restoreStringArrayName(originalComponents);
            MethodFailedException.assert(false, `component was not set correctly`);
        }

        let cond = true;
        for (let i = 0; i < originalComponents.length; i++) {
            if(this.components[i] !== originalComponents[i]) {
                if (i === index) {
                    if (this.components[i] !== c) {
                        cond = false;
                    }
                } else {
                    cond = false;
                }
                
                if (cond === false) {
                    //this.restoreStringArrayName(original);
                    MethodFailedException.assert(cond, `component was not set correctly`);
                }
            }
        }
    }

    protected assertInsertComponent(c: string, index: number, original: string[]): void {
        if (original.length !== this.components.length - 1) {
            //this.restoreStringArrayName(original);
            MethodFailedException.assert(false, `component was not inserted`);
        }

        let cond = true;
        let i_new = 0;
        for (let i_orig = 0; i_orig < original.length; i_orig++) {
            if (i_orig === index) {
                if(this.components[i_new] !== c) {
                    cond = false;
                    //this.restoreStringArrayName(original);
                    MethodFailedException.assert(cond, `component was not inserted`);
                }
                i_new++;
            }
            if(this.components[i_new] !== original[i_orig]) {
                cond = false;
                //this.restoreStringArrayName(original);
                MethodFailedException.assert(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    protected assertAppendComponent(c: string, original: string[]): void {
        if (original.length !== this.components.length - 1) {
            //this.restoreStringArrayName(original);
            MethodFailedException.assert(false, `component was not appended`);
        }

        let cond = true;
        for (let i = 0; i < original.length; i++) {
            if(this.components[i] !== original[i]) {
                cond = false;
                //this.restoreStringArrayName(original);
                MethodFailedException.assert(cond, `component was not appended`);
            }
        }
        if (this.components[original.length] !== c) {
            cond = false;
            //this.restoreStringArrayName(original);
            MethodFailedException.assert(cond, `component was not appended`);
        }
    }

    protected assertRemovedComponent(index: number, original: string[]): void {
        if (original.length !== this.components.length + 1) {
            //this.restoreStringArrayName(original);
            MethodFailedException.assert(false, `component was not removed`);
        }

        let cond = true;
        let i_new = 0;
        for (let i_orig = 0; i_orig < original.length; i_orig++) {
            if (i_orig === index) {
                i_orig++;
            }
            if(this.components[i_new] !== original[i_orig]) {
                cond = false;
                //this.restoreStringArrayName(original);
                MethodFailedException.assert(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    // methods for assertions for class invariants
    protected assertValidComponents(): void {
        for (let i = 0; i < this.components.length; i++) {
            this.assertIsNotUndefined(this.components[i], `component at index ${i} is undefined`);
            InvalidStateException.assert(this.components[i] === this.originalComponents[i], `component at index ${i} was changed`);
        }
    }
}