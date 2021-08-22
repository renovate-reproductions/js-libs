/*
 * Package @donmahallem/readme
 * Source https://donmahallem.github.io/js-libs/
 */

import remarkLernaPlugin from '@donmahallem/remark-lerna-packages';
import remarkVariables from '@donmahallem/remark-variables';
import { promises as fsp } from 'fs';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkGitContributors from 'remark-git-contributors';
import remarkLicense from 'remark-license';
import remarkParse from 'remark-parse';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkToc from 'remark-toc';
import { read } from 'to-vfile';
import { VFile } from 'vfile';
import { reporter } from 'vfile-reporter';

export interface IOptions {
    dryRun: boolean;
    input: string;
    output?: string;
    report?: boolean;
    variables?: any;
}

export async function convert(opts: IOptions): Promise<void> {
    const output: string = opts.output || opts.input;
    const data: VFile = await read(opts.input);
    return remark()
        .use(remarkToc)
        .use(remarkGfm)
        .use(remarkParse)
        .use(remarkGitContributors)
        .use(remarkLicense)
        .use(remarkPresetLintRecommended)
        .use(remarkLernaPlugin)
        .use(remarkVariables, {
            data: opts.variables,
        })
        .process(data)
        .then((file: VFile): Promise<void> | void => {
            if (opts.report !== false) {
                console.error(reporter(file));
            }
            if (opts.dryRun) {
                console.log(String(file));
            } else {
                return fsp.writeFile(output, String(file), 'utf-8');
            }
        });
}
