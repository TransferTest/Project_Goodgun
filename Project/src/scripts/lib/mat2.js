class mat2
{
    static createZero ()
    {
        const ret = [
                        0.0, 0.0,
                        0.0, 0.0,
                    ];
        return ret;
    }
    static createId ()
    {
        const ret = [
                        1.0, 0.0,
                        0.0, 1.0,
                    ];
        return ret;
    }
    static createScale (s)
    {
        const ret = [
                        s[0], 0.0,
                        0.0, s[1],
                    ];
        return ret;
    }
    static createRotation (t)
    {
        const ret = [
                        Math.cos(t), -Math.sin(t),
                        Math.sin(t), Math.cos(t),
                    ];
        return ret;
    }
}