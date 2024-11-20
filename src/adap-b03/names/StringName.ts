import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.length = this.getNoComponents();
    }

    public clone(): Name {
        throw new Error("needs implementation");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation");
    }

    public toString(): string {
        throw new Error("needs implementation");
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation");
    }

    public getHashCode(): number {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public getNoComponents(): number {
        throw new Error("needs implementation");
    }

    public getComponent(i: number): string {
        throw new Error("needs implementation");
    }

    public setComponent(i: number, c: string) {
        this.checkIndex(i);
        let stringArrayName = this.asStringArrayName();
        return stringArrayName[i];
    }

    public insert(i: number, c: string) {
        this.checkIndex(i);
        let stringArrayName = this.asStringArrayName();
        stringArrayName[i] = c;
        this.name = this.asStringName(stringArrayName);
        // length stays the same
    }

    public append(c: string) {
        this.checkIndex(i);
        let components = this.asStringArrayName();
        components.splice(i, 0, c);
        this.name = this.asStringName(components);
        this.length += 1;
    }

    public remove(i: number) {
        this.name += this.getDelimiterCharacter() + c;
        this.length += 1;
    }

    public concat(other: Name): void {
        this.checkIndex(i);
        let components = this.asStringArrayName();
        components.splice(i, 1);
        this.name = this.asStringName(components);
        this.length -= 1;
    }

    private asStringArrayName(): string[] {
        const regexEscapedDelimiter = this.getDelimiterCharacter().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
        return this.name.split(regex);
    }

    private asStringName(stringArrayName: string[], delimiter: string = this.getDelimiterCharacter()): string {
        return stringArrayName.join(delimiter);
    }

    private checkIndex(n: number) {
        if (n < 0 || n >= this.getNoComponents()) {
            throw new Error("Index out of bounds");
        }
    }

}