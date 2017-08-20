import { TypedAction } from './action';

export interface ActionCreator<Type extends string, Payload = {}> {
    (payload: Payload): TypedAction<Type, Payload>;
}
