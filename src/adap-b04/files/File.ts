import { Node } from "./Node";
import { Directory } from "./Directory";
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
        // read something
        return new Int8Array();
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