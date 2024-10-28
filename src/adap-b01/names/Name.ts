export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.components = [...other];
    }

    // @methodtype conversion-method
    /** Returns human-readable representation of Name instance */
    public asNameString(delimiter: string = this.delimiter): string {
        let nameString: string = "";
        this.components.forEach((c, i) => {
            nameString += c;
            if (i < this.getNoComponents() - 1) {
                nameString += delimiter;
            }
        })
        return nameString
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.checkIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.checkIndex(i);
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.checkIndex(i);
        this.components.splice(i, 0, c);
    }

    // @methodtype set-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.checkIndex(i);
        this.components.splice(i, 1);
    }

    private checkIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error("Index out of bounds");
        }
    }

}