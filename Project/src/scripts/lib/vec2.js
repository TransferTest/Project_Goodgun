class vec2
{
    static createZero()
    {
        return [0.0, 0.0];
    }
    static add(v1, v2)
    {
        const ret = [0.0, 0.0];
        ret[0] = v1[0] + v2[0];
        ret[1] = v1[1] + v2[1];
        return ret;
    }
    static sub(v1, v2)
    {
        const ret = [0.0, 0.0];
        ret[0] = v1[0] - v2[0];
        ret[1] = v1[1] - v2[1];
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
    static mmul(M, v)
    {
        const ret = [];
        const len = v.length;
        if (M.length != len * len)
        {
            console.log("Error at mmul : dimension mismatch");
            return null;
        }
        for (let i = 0; i < len; i++)
        {
            var vi = 0.0;
            const offset = len * i;
            for (let j = 0; j < len; j++)
            {
                const aij = M[offset + j];
                vi += aij * v[j];
            }
            ret.push(vi);
        }
        return ret;
    }
    static copy(v)
    {
        const ret = [];
        for (let i = 0; i < v.length; i++)
        {
            ret.push(v[i]);
        }
        return ret;
    }
}