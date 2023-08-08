
export abstract class HandlerAbstract implements HandlerInterface {
    
    next: HandlerInterface | undefined;

    constructor(next: HandlerAbstract | undefined) {
        this.next = next;
    }

    abstract handler(path: string, extention: string): void;

    abstract configurePattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): void;
}