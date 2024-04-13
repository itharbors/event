import { describe, it, before } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { EventEmitter } from '../build/index.mjs';

describe('使用 addListener 监听并触发一个事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addListener('test', (val) => {
            count++;
            result = val;
            return 'a';
        });
        results.push(...emitter.emit('test', 2));
    });

    it('检查触发次数', () => {
        equal(1, count);
    });

    it('检查触发传参', () => {
        equal(2, result);
    });

    it('检查 results', () => {
        deepEqual([{ result: 'a', }], results);
    });
});

describe('使用 addListener 监听并多次触发一个事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addListener('test', (val) => {
            count++;
            result = val;

            return 'a';
        });
        results.push(...emitter.emit('test', 2));
        results.push(...emitter.emit('test', 3));
    });

    it('检查触发次数', () => {
        equal(2, count);
    });

    it('检查触发传参', () => {
        equal(3, result);
    });

    it('检查 results', () => {
        deepEqual([{ result: 'a', }, { result: 'a'}], results);
    });
});

describe('使用 addListener 监听并多次触发一个不存在的事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addListener('test', (val) => {
            count++;
            result = val;

            return 'a';
        });
        results.push(...emitter.emit('a', 2));
        results.push(...emitter.emit('a', 3));
    });

    it('检查触发次数', () => {
        equal(0, count);
    });

    it('检查触发传参', () => {
        equal(0, result);
    });

    it('检查 results', () => {
        deepEqual([], results);
    });
});

describe('使用 addOnceListener 监听并触发一个事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addOnceListener('test', (val) => {
            count++;
            result = val;

            return 'a';
        });
        results.push(...emitter.emit('test', 2));
    });

    it('检查触发次数', () => {
        equal(1, count);
    });

    it('检查触发传参', () => {
        equal(2, result);
    });

    it('检查 results', () => {
        deepEqual([{ result: 'a', }], results);
    });
});

describe('使用 addOnceListener 监听并多次触发一个事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addOnceListener('test', (val) => {
            count++;
            result = val;

            return 'a';
        });
        results.push(...emitter.emit('test', 2));
        results.push(...emitter.emit('test', 3));
    });

    it('检查触发次数', () => {
        equal(1, count);
    });

    it('检查触发传参', () => {
        equal(2, result);
    });

    it('检查 results', () => {
        deepEqual([{ result: 'a', }], results);
    });
});

describe('使用 addOnceListener 监听并多次触发一个不存在的事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        emitter.addOnceListener('test', (val) => {
            count++;
            result = val;

            return 'a';
        });
        results.push(...emitter.emit('a', 2));
        results.push(...emitter.emit('a', 3));
    });

    it('检查触发次数', () => {
        equal(0, count);
    });

    it('检查触发传参', () => {
        equal(0, result);
    });

    it('检查 results', () => {
        deepEqual([], results);
    });
});

describe('使用 removeListener 取消监听一个不存在的事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        function func(val) {
            count++;
            result = val;

            return 'a';
        };
        emitter.addListener('a', func);
        emitter.removeListener('b', func);
        results.push(...emitter.emit('a', 2));
    });

    it('检查触发次数', () => {
        equal(1, count);
    });

    it('检查触发传参', () => {
        equal(2, result);
    });

    it('检查 results', () => {
        deepEqual([{ result: 'a', }], results);
    });
});

describe('使用 removeListener 取消监听一个存在的事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        function func(val) {
            count++;
            result = val;

            return 'a';
        };
        emitter.addListener('a', func);
        emitter.removeListener('a', func);
        results.push(...emitter.emit('a', 2));
    });

    it('检查触发次数', () => {
        equal(0, count);
    });

    it('检查触发传参', () => {
        equal(0, result);
    });

    it('检查 results', () => {
        deepEqual([], results);
    });
});

describe('使用 clear 取消监听所有事件', () => {
    let count = 0;
    let result = 0;
    let results = [];
    const emitter = new EventEmitter();

    before(() => {
        function func(val) {
            count++;
            result = val;

            return 'a';
        };
        emitter.addListener('a', func);
        emitter.clear();
        results.push(...emitter.emit('a', 2));
    });

    it('检查触发次数', () => {
        equal(0, count);
    });

    it('检查触发传参', () => {
        equal(0, result);
    });

    it('检查 results', () => {
        deepEqual([], results);
    });
});
