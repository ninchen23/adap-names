import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.length = this.getNoComponents();
    }

    getNoComponents(): number {
        return this.asStringArrayName().length;
    }

    getComponent(i: number): string {
        this.checkIndex(i);
        let stringArrayName = this.asStringArrayName();
        return stringArrayName[i];
    }
    setComponent(i: number, c: string) {
        this.checkIndex(i);
        let stringArrayName = this.asStringArrayName();
        stringArrayName[i] = c;
        this.name = this.asStringName(stringArrayName);
        // length stays the same
    }

    insert(i: number, c: string) {
        this.checkIndex(i);
        let components = this.asStringArrayName();
        components.splice(i, 0, c);
        this.name = this.asStringName(components);
        this.length += 1;
    }
    append(c: string) {
        this.name += this.getDelimiterCharacter() + c;
        this.length += 1;
    }
    remove(i: number) {
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