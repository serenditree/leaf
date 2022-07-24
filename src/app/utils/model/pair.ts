export class Pair<K, V> {
    private readonly _key: K;
    private readonly _value: V;

    constructor(key: K, value: V) {
        this._key = key;
        this._value = value;
    }

    public key(): K {
        return this._key;
    }

    public value(): V {
        return this._value;
    }

    public first(): K {
        return this._key;
    }

    public second(): V {
        return this._value;
    }
}
