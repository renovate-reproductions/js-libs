/*
 * Package @donmahallem/label-gh
 * Source https://donmahallem.github.io/js-libs/
 */

import { Endpoints } from '@octokit/types';

export type PRLabelsParameter = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['parameters'];
export type PRLabelsResponse = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response'];
export type PRLabel = PRLabelsResponse['data']['labels'][0];
export type GetRepoLabelsParameters = Endpoints['GET /repos/{owner}/{repo}/labels']['parameters'];
export type GetRepoLabelsResponse = Endpoints['GET /repos/{owner}/{repo}/labels']['response'];
export type GithubLabel = GetRepoLabelsResponse['data'][0];
