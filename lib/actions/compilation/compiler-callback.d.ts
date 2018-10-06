import { Stats } from 'webpack';
interface WebpackCompileError extends Error {
    details?: any;
}
export declare const compilerCallback: (watch?: boolean, spa?: boolean) => (error: WebpackCompileError, stats: Stats) => void;
export {};
