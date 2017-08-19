import { TypedAction } from './action';

export interface ActionCreator<T extends string, P = {}> {
    (payload: P): TypedAction<T, P>;
}
