
export abstract class HandlerAbstract implements HandlerInterface {
    
    next: HandlerInterface | undefined;

    constructor(next: HandlerAbstract | undefined) {
        this.next = next;
    }

    abstract handler(patch: string, extention: string): void;
}