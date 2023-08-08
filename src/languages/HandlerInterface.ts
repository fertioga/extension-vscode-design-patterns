
interface HandlerInterface {
    handler(path: string | undefined, extention: string | undefined | boolean): void;

    configurePattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): void;
}