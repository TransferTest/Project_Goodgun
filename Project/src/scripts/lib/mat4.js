class mat4
{
    static createZero ()
    {
        const ret = [
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                    ];
        return ret;
    }
    static createId ()
    {
        const ret = [
                        1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0,
                    ];
        return ret;
    }
    static createScale (s)
    {
        const ret = [
                        s[0], 0.0, 0.0, 0.0,
                        0.0, s[1], 0.0, 0.0,
                        0.0, 0.0, s[2], 0.0,
                        0.0, 0.0, 0.0, s[3],
                    ];
        return ret;
    }
    static createRotation (t)
    {
        const ret = [
                        1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0,
                    ];
        return ret;
    }
}