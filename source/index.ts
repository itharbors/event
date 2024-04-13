/**
 * 事件发射器
 * 和 NodeJS 原生的相比，增加了事件定义
 * 支持在实例化的时候给出事件定义，后续在使用的时候严格限制类型
 */

interface HandleItem {
    handle: Function;
    once: boolean;
}

interface HandleResult {
    result?: any;
    error?: any;
}

export interface EventTable {
    [action: string]: {
        params: any[];
        result: any;
    };
}

/**
 * 事件发射器
 * 不处理异步事件，所有监听函数必须是同步函数
 */
export class EventEmitter<T extends EventTable = EventTable> {

    private _events: { [action: string]: HandleItem[] } = {};

    /**
     * 监听一个事件
     * @param action 
     * @param handle 
     */
    addListener<A extends keyof T>(action: A, handle: (...args: T[A]['params']) => T[A]['result']) {
        const HandleArray = this._events[action as string] = this._events[action as string] || [];

        if (HandleArray.find(item => item.handle === handle)) {
            return console.error(`Please do not listen to the same function repeatedly.`);
        }

        HandleArray.push({
            handle,
            once: false,
        });
    }

    /**
     * 监听一个事件，触发后立即删除
     * @param action 
     * @param handle 
     */
    addOnceListener<A extends keyof T>(action: A, handle: (...args: T[A]['params']) => T[A]['result']) {
        const HandleArray = this._events[action as string] = this._events[action as string] || [];

        if (HandleArray.find(item => item.handle === handle)) {
            return console.error(`Please do not listen to the same function repeatedly.`);
        }

        HandleArray.push({
            handle,
            once: true,
        });
    }

    /**
     * 取消一个事件监听
     * @param action 
     * @param handle 
     */
    removeListener<A extends keyof T>(action: A, handle: (...args: T[A]['params']) => T[A]['result']) {
        if (!handle) {
            if (this._events[action as string]) {
                this._events[action as string].length === 0;
                delete this._events[action as string];
            }
            return;
        }

        const HandleArray = this._events[action as string] = this._events[action as string] || [];

        for (let i = 0; i < HandleArray.length; i++) {
            const Item = HandleArray[i];
            if (Item.handle === handle) {
                HandleArray.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 清空事件监听
     * @param action 
     */
    clear<A extends keyof T>(action?: A) {
        if (action) {
            if (this._events[action as string]) {
                this._events[action as string].length === 0;
                delete this._events[action as string];
            }
            return;
        }
        Object.keys(this._events).forEach((name) => {
            this._events[name].length === 0;
            delete this._events[name];
        });
    }

    /**
     * 触发一个事件
     * 遇到错误，会直接中断后续处理，并返回 reuslts
     * @param action 
     * @param args 
     */
    emit<A extends keyof T>(action: A, ...args: T[A]['params']): HandleResult[] {
        if (!this._events[action as string]) {
            return [];
        }
        const HandleArray = this._events[action as string];
        const results: HandleResult[] = [];

        for (let i = 0; i < HandleArray.length; i++) {
            const HandleItem =  HandleArray[i];
            if (HandleItem.once) {
                HandleArray.splice(i, 1);
                i--;
            }

            try {
                const result = HandleItem.handle.call(this, ...args);
                results.push({
                    result,
                });
            } catch(error) {
                results.push({
                    error,
                });
            }
        }

        return results;
    }
}
