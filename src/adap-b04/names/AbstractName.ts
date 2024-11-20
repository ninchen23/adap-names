import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { createHash } from 'crypto';
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";



export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }

        this.assertCorrectDelimiter(delimiter);
    }

    protected assertAbstractNameInvariants() {
        InvalidStateException.assertNotNullOrUndefined(this.delimiter, "this.delimiter is null or undefined");
    }

    public clone(): Name {
        const emptyClone = Object.create(Object.getPrototypeOf(this));
        const clone = Object.assign(emptyClone, this);

        MethodFailureException.assertNotNullOrUndefined(clone, "clone is null or undefined");
        MethodFailureException.assertCondition(this !== clone, "this is the same as clone");
        MethodFailureException.assertCondition(this.isEqual(clone), "clone is not equal to this");
        return clone;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assertIsNotNullOrUndefined(delimiter, "delimiter in asString cannot be null or undefined");

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
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "other in isEqual cannot be null or undefined");

        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter() || other.getNoComponents() !== this.getNoComponents()) {
            return false
        }

        const numberOfComponents = this.getNoComponents();

        for (let i = 0; i < numberOfComponents; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false
            }
        }

        MethodFailureException.assertCondition(this.getHashCode() === other.getHashCode(), "hash codes are not equal");
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
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "other in isEqual cannot be null or undefined");
        
        // TODO ???

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    
    // methods for assertions
    protected assertCorrectDelimiter(delimiter: string | undefined): void {
        const cond = (delimiter? delimiter : DEFAULT_DELIMITER) === this.delimiter;
        MethodFailureException.assertCondition(cond, "Name not correctly consructed");
    }

    protected assertValidIndex(n: number): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(n);
        const cond = (n >= 0 && n < this.getNoComponents());
        IllegalArgumentException.assertCondition(cond, "Index out of bounds");
    }
}