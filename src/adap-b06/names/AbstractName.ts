import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { createHash } from 'crypto';
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected originalDelimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiter(delimiter);
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
            this.originalDelimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
            this.originalDelimiter = DEFAULT_DELIMITER;
        }

        this.assertCorrectDelimiter(delimiter);
    }

    protected assertAbstractNameInvariants() {
        this.assertIsNotUndefined(this.delimiter, "this.delimiter is undefined", false);
        this.assertValidDelimiter(this.delimiter);
        InvalidStateException.assert(this.delimiter === this.originalDelimiter, "delimiter was changed");
    }

    public clone(): Name {
        this.assertAbstractNameInvariants()

        const emptyClone = Object.create(Object.getPrototypeOf(this));
        const clone = Object.assign(emptyClone, this);

        this.assertCorrectClone(clone);
        this.assertAbstractNameInvariants()
        return clone;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);

        let comps: string[] = [];
        
        for(let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i).replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter()));
        }

        return comps.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let comps: string[] = [];
    
        for(let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i));
        }

        let name = comps.join(this.delimiter);
        let delimiter = this.getDelimiterCharacter();

        // make dictionary of name and delimiter
        let dict = {'dataString': name, 'delimiter': delimiter};

        // return string of dict
        return JSON.stringify(dict);
    }

    public isEqual(other: Name): boolean {
        this.assertParameterNotUndefined(other, "other in isEqual cannot be undefined");

        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter() || other.getNoComponents() !== this.getNoComponents()) {
            return false
        }

        const numberOfComponents = this.getNoComponents();

        for (let i = 0; i < numberOfComponents; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false
            }
        }

        MethodFailedException.assert(this.getHashCode() === other.getHashCode(), "hash codes are not equal");
        return true
    }

    public getHashCode(): number {
        const hash = createHash('sha256').update(this.asDataString()).digest('hex');

        const bigIntHash = BigInt(`0x${hash}`);

        const numberHash = Number(bigIntHash % BigInt(Number.MAX_SAFE_INTEGER));
        return numberHash
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    abstract concat(other: Name): Name;



    protected assertIsNotUndefined(o: Object | undefined, msg: string = "object is undefined", isInvalidStateException: boolean = false): void {
        if (o === undefined) {
            if (!isInvalidStateException) {
                throw new IllegalArgumentException("object is undefined");
            } else {
                throw new InvalidStateException("object is undefined");
            }
        }
    }
    
    // methods for assertions (pre-conditions)
    protected assertValidDelimiter(delimiter: string): void {
        this.assertIsNotUndefined(delimiter, "delimiter cannot be null or undefined");
        const cond = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
        IllegalArgumentException.assert(cond, "Delimiter must be a single character and not the escape character");
    }

    protected assertParameterNotUndefined(o: Object | undefined, msg: string = "object undefined"): void {
        this.assertIsNotUndefined(o, msg);
    }

    protected assertValidIndex(n: number): void {
        this.assertIsNotUndefined(n);
        const cond = (n >= 0 && n < this.getNoComponents());
        IllegalArgumentException.assert(cond, "Index out of bounds");
    }


    // methods for assertions (post-conditions)
    protected assertCorrectDelimiter(delimiter: string | undefined): void {
        const cond = (delimiter? delimiter : DEFAULT_DELIMITER) === this.delimiter;
        MethodFailedException.assert(cond, "Name not correctly consructed");
    }

    protected assertCorrectClone(clone: Name): void {
        if (clone === undefined) {
            throw new MethodFailedException("clone is undefined");
        }
        MethodFailedException.assert(this !== clone, "this is the same as clone");
        MethodFailedException.assert(this.isEqual(clone), "clone is not equal to this");
    }

    // protected restoreName(original: Name): void {
    //     this.delimiter = original.getDelimiterCharacter();
    //     for (let i = 0; i < original.getNoComponents(); i++) {
    //         this.setComponent(i, original.getComponent(i));
    //     }
    //     if (this.getNoComponents() > original.getNoComponents()) {
    //         for(let i = original.getNoComponents(); i < this.getNoComponents(); i++) {
    //             this.remove(i);
    //         }
    //     }
    // }

    protected assertConcatComponents(original: Name, other: Name): void {
        const cond = this.getNoComponents() === original.getNoComponents() + other.getNoComponents();
        //this.restoreName(original);
        MethodFailedException.assert(cond, "Components not concatenated");

        for (let i = 0; i < original.getNoComponents(); i++) {
            const cond = this.getComponent(i) === original.getComponent(i);
            //this.restoreName(original);
            MethodFailedException.assert(cond, "Components not concatenated");
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            const cond = this.getComponent(i + original.getNoComponents()) === other.getComponent(i);
            //this.restoreName(original);
            MethodFailedException.assert(cond, "Components not concatenated");
        }
    }

}