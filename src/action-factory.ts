import { ActionCreator } from './action-creator';

export class ActionFactory<M> {

    public create<T extends keyof M>(type: T): ActionCreator<T, M[T]> {
        return payload => ({ type, payload });
    }
}
