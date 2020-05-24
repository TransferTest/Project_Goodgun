class vec4
{
    static createZero()
    {
        const ret = [
            0.0,
            0.0,
            0.0,
            0.0,
        ];
        return ret;
    }
    static add(a, b)
    {
        const ret = [];
        var len = a.length;
        if (b.length < len)
        {
            len = b.length;
        }
        for (let i = 0; i < len; i++)
        {
            ret.push(a[i] + b[i]);
        }
        return ret;
    }
    static sub(a, b)
    {
        const ret = [];
        var len = a.length;
        if (b.length < len)
        {
            len = b.length;
        }
        for (let i = 0; i < len; i++)
        {
            ret.push(a[i] - b[i]);
        }
        return ret;
    }
    static mul(a, b)
    {
        const ret = [];
        var len = a.length;
        if (b.length < len)
        {
            len = b.length;
        }
        for (let i = 0; i < len; i++)
        {
            ret.push(a[i] * b[i]);
        }
        return ret;
    }
    static smul(a, s)
    {
        const ret = [];
        var len = a.length;
        for (let i = 0; i < len; i++)
        {
            ret.push(a[i] * s);
        }
        return ret;
    }
}