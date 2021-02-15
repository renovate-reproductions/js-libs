/*!
 * Source https://github.com/donmahallem/js-libs Package: sync-gist
 */

import { promises as fsp } from 'fs';
import { basename, resolve } from 'path';
import { InputFileContent, IInputFile } from './types';

export const loadFileContent: (file: IInputFile, cwd?: string) => Promise<InputFileContent>
    = async (file: IInputFile, cwd?: string): Promise<InputFileContent> => {
        const resolvedFilePath: string = cwd ? resolve(cwd, file.source) : resolve(file.source);
        const fileContent: string = await fsp.readFile(resolvedFilePath, 'utf-8');
        return {
            content: fileContent,
            filename: basename(file.filename ? file.filename : resolvedFilePath),
            source: resolvedFilePath,
        };
    };
