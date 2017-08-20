import { ActionCreator } from './models/action-creator';

export class ActionFactory<ActionMap> {

    public creator<Type extends keyof ActionMap>(type: Type): ActionCreator<Type, ActionMap[Type]> {
        return payload => ({ type, payload });
    }
}
