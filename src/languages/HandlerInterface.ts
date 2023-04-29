
interface HandlerInterface {
    handler(patch: string | undefined, extention: string | undefined | boolean): void;

    copyPattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): Promise<void>;
}