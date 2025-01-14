/*
 * Package @donmahallem/turbo
 * Source https://github.com/donmahallem/js-libs/tree/master/packages/turbo
 */

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { promiseToResponse } from './promise-to-response';

/* eslint-disable @typescript-eslint/no-unsafe-argument,
 @typescript-eslint/no-unsafe-assignment,
 @typescript-eslint/no-unsafe-member-access */
describe('promise-to-response.ts', (): void => {
    describe('promiseToResponse(prom,res)', (): void => {
        let jsonSpy: sinon.SinonSpy;
        let nextSpy: sinon.SinonSpy;
        let statusStub: sinon.SinonStub;
        let resObj: any;
        const testResponse: any = {
            success: true,
            test: 'response',
        };
        before((): void => {
            jsonSpy = sinon.spy();
            nextSpy = sinon.spy();
            statusStub = sinon.stub();
            resObj = {
                json: jsonSpy,
                status: statusStub,
            };
            statusStub.returns(resObj);
        });
        afterEach((): void => {
            jsonSpy.resetHistory();
            nextSpy.resetHistory();
            statusStub.resetHistory();
        });
        describe('promise resolves', (): void => {
            [true, false].forEach((nextProvided: boolean): void => {
                describe(`next parameter ${nextProvided ? '' : 'not'} provided`, (): void => {
                    it('should forward the resolved value to the response', (done: Mocha.Done): void => {
                        if (nextProvided) {
                            promiseToResponse(Promise.resolve(testResponse), resObj, nextSpy);
                        } else {
                            promiseToResponse(Promise.resolve(testResponse), resObj);
                        }
                        setTimeout((): void => {
                            expect(nextSpy.callCount).to.equal(0);
                            expect(statusStub.callCount).to.equal(1);
                            expect(jsonSpy.callCount).to.equal(1);
                            expect(statusStub.getCall(0).args).to.deep.equal([200]);
                            expect(jsonSpy.getCall(0).args).to.deep.equal([testResponse]);
                            done();
                        }, 100);
                    });
                    it('should forward the resolved value to the response and not send status', (done: Mocha.Done): void => {
                        const testResponseObject: any = Object.assign(
                            {
                                headersSent: true,
                            },
                            resObj
                        );
                        if (nextProvided) {
                            promiseToResponse(Promise.resolve(testResponse), testResponseObject, nextSpy);
                        } else {
                            promiseToResponse(Promise.resolve(testResponse), testResponseObject);
                        }
                        setTimeout((): void => {
                            expect(nextSpy.callCount).to.equal(0);
                            expect(statusStub.callCount).to.equal(0);
                            expect(jsonSpy.callCount).to.equal(1);
                            expect(jsonSpy.getCall(0).args).to.deep.equal([testResponse]);
                            done();
                        }, 100);
                    });
                });
            });
        });
        describe('promise rejects', (): void => {
            const testErrors: any[] = [
                {
                    error: {
                        message: 'another message',
                        statusCode: 400,
                    },
                    response: {
                        statusCode: 400,
                    },
                },
                {
                    error: new Error('test erorr'),
                    response: {
                        statusCode: 500,
                    },
                },
                {
                    error: {
                        isAxiosError: true,
                        message: 'another message',
                        status: 321,
                    },
                    response: {
                        statusCode: 500,
                    },
                },
                {
                    error: {
                        isAxiosError: true,
                        response: {
                            status: 123,
                        },
                    },
                    response: {
                        statusCode: 123,
                    },
                },
                {
                    error: {
                        isAxiosError: true,
                        response: {},
                    },
                    response: {
                        statusCode: 500,
                    },
                },
            ];
            describe('next parameter provided', (): void => {
                testErrors.forEach((testError: any): void => {
                    it('should forward the error to the next function', (done: Mocha.Done): void => {
                        promiseToResponse(Promise.reject(testError.error), resObj, nextSpy);
                        setTimeout((): void => {
                            expect(nextSpy.callCount).to.equal(1);
                            expect(statusStub.callCount).to.equal(0);
                            expect(jsonSpy.callCount).to.equal(0);
                            expect(nextSpy.getCall(0).args).to.deep.equal([testError.error]);
                            done();
                        }, 100);
                    });
                });
            });
            describe('next parameter not provided', (): void => {
                testErrors.forEach((testError: any): void => {
                    it('should forward the error to the next function', (done: Mocha.Done): void => {
                        promiseToResponse(Promise.reject(testError.error), resObj);
                        setTimeout((): void => {
                            expect(nextSpy.callCount).to.equal(0);
                            expect(statusStub.callCount).to.equal(1);
                            expect(jsonSpy.callCount).to.equal(1);
                            expect(statusStub.getCall(0).args).to.deep.equal([testError.response.statusCode]);
                            expect(jsonSpy.getCall(0).args).to.deep.equal([
                                {
                                    error: true,
                                    statusCode: testError.response.statusCode,
                                },
                            ]);
                            done();
                        }, 100);
                    });
                });
            });
        });
    });
});
