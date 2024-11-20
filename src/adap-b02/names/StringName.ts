import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = other;
        this.noComponents = this.getNoComponents();
    }

    public asString(delimiter: string = this.delimiter): string {
        let components = this.asStringArrayName();
        components.forEach((c, i) => {
            components[i] = c.replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter());
        });
        return this.asStringName(components, delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.asStringArrayName().length;
    }

    public getComponent(x: number): string {
        this.checkIndex(x);
        let stringArrayName = this.asStringArrayName();
        return stringArrayName[x];
    }

    public setComponent(n: number, c: string): void {
        this.checkIndex(n);
        let stringArrayName = this.asStringArrayName();
        stringArrayName[n] = c;
        this.name = this.asStringName(stringArrayName);
        // noComponents stays the same
    }

    public insert(n: number, c: string): void {
        this.checkIndex(n);
        let components = this.asStringArrayName();
        components.splice(n, 0, c);
        this.name = this.asStringName(components);
        this.noComponents += 1;
    }

    public append(c: string): void {
        this.name += this.getDelimiterCharacter() + c;
        this.noComponents += 1;
    }

    public remove(n: number): void {
        this.checkIndex(n);
        let components = this.asStringArrayName();
        components.splice(n, 1);
        this.name = this.asStringName(components);
        this.noComponents -= 1;
    }

    public concat(other: Name): void {
        this.name += this.getDelimiterCharacter() + other.asString(this.getDelimiterCharacter());
        this.noComponents += other.getNoComponents();
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