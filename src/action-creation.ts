import { TypedAction } from './action';

export interface ActionCreator<Type extends string, Payload = {}> {
    (payload: Payload): TypedAction<Type, Payload>;
}

export class ActionFactory<ActionMap> {
    public creator<Type extends keyof ActionMap>(
        type: Type
    ): ActionCreator<Type, ActionMap[Type]> {
        return payload => ({ type, payload });
    }
}
