import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { createHash } from 'crypto';

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
    }
    
    public clone(): Name {
        const clone = Object.create(Object.getPrototypeOf(this));
        return Object.assign(clone, this);
    }

    public asString(delimiter: string = this.delimiter): string {
        let comps: string[] = [];
        
        for(let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i).replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter()));
        }

        return comps.join(delimiter);
    }

    /*
    unsure what this function should do
    https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=386954&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
    */
    public toString(): string {
        return this.asDataString();
    }

    /*
    unsure which delimiter to use
    */
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

    /*
    unsure which implementation is meant here (definition of equality unclear)
    */
    public isEqual(other: Name): boolean {
        // const selfString = this.asString();
        // const otherString  = other.asString();
        // return selfString === otherString


        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter() || other.getNoComponents() !== this.getNoComponents()) {
            return false
        }

        const numberOfComponents = this.getNoComponents();

        for (let i = 0; i < numberOfComponents; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false
            }
        }
        return true


        // return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        const hash = createHash('sha256').update(this.asDataString()).digest('hex');

        const bigIntHash = BigInt(`0x${hash}`);

        //console.log(bigIntHash);

        // convert hex string to number
        const numberHash = Number(bigIntHash % BigInt(Number.MAX_SAFE_INTEGER));
        return numberHash
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}