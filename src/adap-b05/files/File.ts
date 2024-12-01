import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertOpen();
        // do something
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        this.assertClosed();
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }


    // Methods for assertion
    protected assertOpen(): void {
        IllegalArgumentException.assertCondition(this.state === FileState.CLOSED, "Cannot open a file that is already open or deleted");
    }

    protected assertClosed(): void {
        IllegalArgumentException.assertCondition(this.state === FileState.OPEN, "Cannot close a file that is already closed or deleted");
    }

}