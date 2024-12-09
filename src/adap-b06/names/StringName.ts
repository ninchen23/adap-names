import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { S } from "vitest/dist/chunks/config.CHuotKvS";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    protected originalName: string;
    protected originalNoComponents: number;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        this.assertParameterNotUndefined(source, "other in constructor of StringName cannot be undefined");

        this.name = source;
        this.originalName = source;
        this.noComponents = this.getNoComponents();
        this.originalNoComponents = this.noComponents;

        this.assertCorrectState(source);
    }

    protected assertStringNameInvariants() {
        super.assertAbstractNameInvariants();
        InvalidStateException.assert(this.name === this.originalName, "name was changed");
        InvalidStateException.assert(this.noComponents === this.originalNoComponents, "noComponents was changed");

        this.assertIsNotUndefined(this.name, "this.name is undefined", true);
        this.assertIsNotUndefined(this.noComponents, "this.noComponents is undefined", true);
        this.assertValidNoComponents();
    }

    public getNoComponents(): number {
        return this.asStringArrayName().length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        this.assertStringNameInvariants();

        let stringArrayName = this.asStringArrayName();
        const component = stringArrayName[i]

        this.assertCorrectComponent(component, i);
        this.assertStringNameInvariants();
        return component;
    }

    public setComponent(i: number, c: string): StringName {
        this.assertCorrectParamsSetComponent(i, c);
        this.assertStringNameInvariants();
        const original = this.name;
        const noComponents = this.noComponents;

        let stringArrayName = this.asStringArrayName();
        stringArrayName[i] = c;
        const newName = this.asStringName(stringArrayName);
        const newStringName = new StringName(newName, this.getDelimiterCharacter());

        newStringName.assertSetComponent(c, i, original, noComponents);
        return newStringName;
    }

    public insert(i: number, c: string): StringName {
        this.assertCorrectParamsInsert(i, c);
        this.assertStringNameInvariants();
        const original = this.name;
        const noComponents = this.noComponents;

        let stringArrayName = this.asStringArrayName();
        stringArrayName.splice(i, 0, c);
        const newName = this.asStringName(stringArrayName);
        const newStringName = new StringName(newName, this.getDelimiterCharacter());

        newStringName.assertInsertComponent(c, i, original, noComponents);
        this.assertStringNameInvariants();
        return newStringName;
    }

    public append(c: string): StringName {
        this.assertCorrectParamsAppend(c);
        this.assertStringNameInvariants();
        const original = this.name;
        const noComponents = this.noComponents;

        const stringArrayName = this.asStringArrayName();
        stringArrayName.push(c);
        const newName = this.asStringName(stringArrayName);
        const newStringName = new StringName(newName, this.getDelimiterCharacter());

        newStringName.assertAppendComponent(c, original, noComponents);
        this.assertStringNameInvariants();
        return newStringName;
    }

    public remove(i: number): StringName {
        this.assertValidIndex(i);
        this.assertStringNameInvariants();
        const original = this.name;
        const orig_noComponents = this.noComponents;

        const stringArrayName = this.asStringArrayName();
        stringArrayName.splice(i, 1);
        const newName = this.asStringName(stringArrayName);
        const newStringName = new StringName(newName, this.getDelimiterCharacter());

        newStringName.assertRemovedComponent(i, original, orig_noComponents);
        this.assertStringNameInvariants();
        return newStringName;
    }

    public concat(other: Name): Name {
        this.assertParameterNotUndefined(other, "other in concat cannot be undefined");
        this.assertStringNameInvariants();
        // save original in case of failure of the post-condition
        const original = this.name;

        const stringArrayName = this.asStringArrayName();
        for (let i = 0; i < other.getNoComponents(); i++) {
            stringArrayName.push(other.getComponent(i));
        }
        const newName = this.asStringName(stringArrayName);
        const newStringName = new StringName(newName, this.getDelimiterCharacter());

        newStringName.assertConcatComponents(this, other);
        this.assertStringNameInvariants();
        return newStringName;
    }





    
    // methods for assertions for pre-conditions
    protected assertCorrectParamsSetComponent(i: number, c: string) {
        this.assertValidIndex(i);
        this.assertIsNotUndefined(c, "component to set cannot be null or undefined");
    }

    protected assertCorrectParamsInsert(i: number, c: string) {
        this.assertValidIndex(i);
        this.assertIsNotUndefined(c, "component to insert cannot be null or undefined");
    }

    protected assertCorrectParamsAppend(c: string) {
        this.assertIsNotUndefined(c, "component to append cannot be null or undefined");
    }


    // methods for assertions for post-conditions
    protected assertCorrectState(name: string): void {
        const cond = this.name === name;
        MethodFailedException.assert(cond, "StringName not correctly consructed");
    }

    // private restoreStringName(original: string, noComponents: number) {
    //     this.name = original;
    //     this.noComponents = noComponents;
    // }

    protected assertCorrectComponent(component: string, index: number) {
        let cond = false;
        const stringArrayName = this.asStringArrayName();
        for (let i = 0; i < stringArrayName.length; i++) {
            if(stringArrayName[i] === component) {
                if (i === index) {
                    cond = true;
                    break;
                }
            }
        }
        MethodFailedException.assert(cond, `component is not the same as the one with index ${index}`);
    }

    protected assertSetComponent(c: string, index: number, original: string, noComponents: number): void {
        if (noComponents !== this.noComponents) {
            //this.restoreStringName(original, noComponents);
            MethodFailedException.assert(false, `component was not set correctly`);
        }

        let cond = true;
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);
        for (let i = 0; i < noComponents; i++) {
            if(stringArrayName[i] !== origArrayName[i]) {
                if (i === index) {
                    if (stringArrayName[i] !== c) {
                        cond = false;
                    }
                } else {
                    cond = false;
                }
                
                if (cond === false) {
                    //this.restoreStringName(original, noComponents);
                    MethodFailedException.assert(cond, `component was not set correctly`);
                }
            }
        }
    }

    protected assertInsertComponent(c: string, index: number, original: string, noComponents: number): void {
        if (noComponents !== this.noComponents - 1) {
            //this.restoreStringName(original, noComponents);
            MethodFailedException.assert(false, `component was not inserted`);
        }

        let cond = true;
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);
        let i_new = 0;
        for (let i_orig = 0; i_orig < noComponents; i_orig++) {
            if (i_orig === index) {
                if(stringArrayName[i_new] !== c) {
                    cond = false;
                    //this.restoreStringName(original, noComponents);
                    MethodFailedException.assert(cond, `component was not inserted`);
                }
                i_new++;
            }
            if(stringArrayName[i_new] !== origArrayName[i_orig]) {
                cond = false;
                //this.restoreStringName(original, noComponents);
                MethodFailedException.assert(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    protected assertAppendComponent(c: string, original: string, noComponents: number): void {
        if (noComponents !== this.noComponents - 1) {
            //this.restoreStringName(original, noComponents);
            MethodFailedException.assert(false, `component was not appended`);
        }

        let cond = true;
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);
        for (let i = 0; i < noComponents; i++) {
            if(stringArrayName[i] !== origArrayName[i]) {
                cond = false;
                //this.restoreStringName(original, noComponents);
                MethodFailedException.assert(cond, `component was not appended`);
            }
        }
        if (stringArrayName[noComponents] !== c) {
            cond = false;
            //this.restoreStringName(original, noComponents);
            MethodFailedException.assert(cond, `component was not appended`);
        }
    }

    protected assertRemovedComponent(index: number, original: string, noComponents: number): void {
        if (noComponents !== this.noComponents + 1) {
            //this.restoreStringName(original, noComponents);
            MethodFailedException.assert(false, `component was not removed`);
        }

        let cond = true;
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);
        let i_new = 0;
        for (let i_orig = 0; i_orig < noComponents; i_orig++) {
            if (i_orig === index) {
                i_orig++;
            }
            if(stringArrayName[i_new] !== origArrayName[i_orig]) {
                cond = false;
                //this.restoreStringName(original, noComponents);
                MethodFailedException.assert(cond, `component was not removed`);
            }
            i_new++;
        }
    }

    
    // methods for assertions for class invariants
    private assertValidNoComponents() {
        const cond = this.noComponents === this.getNoComponents();
        InvalidStateException.assert(cond, "noComponents is not equal to the number of components in the name");
    }


    // helper methods
    private asStringArrayName(str: string=this.name): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return str.split(regex);
    }

    private asStringName(stringArrayName: string[], delimiter: string = this.getDelimiterCharacter()): string {
        return stringArrayName.join(delimiter);
    }

}