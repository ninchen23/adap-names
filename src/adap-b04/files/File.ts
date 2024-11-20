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
        IllegalArgumentException.assertCondition(this.state === FileState.CLOSED, "Cannot open a file that is already open or deleted");
        // do something
    }

    public close(): void {
        IllegalArgumentException.assertCondition(this.state === FileState.OPEN, "Cannot close a file that is already closed or deleted");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}