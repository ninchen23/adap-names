import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.components = [...other];
    }

    public asString(delimiter: string = this.delimiter): string {
        let comps: string[] = [];
        this.components.forEach((c, _) => {
            // replace each old escaped delimiter with the delimiter
            comps.push(c.replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter()));
        });
        return comps.join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.checkIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.checkIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.checkIndex(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.checkIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    private checkIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error("Index out of bounds");
        }
    }

}