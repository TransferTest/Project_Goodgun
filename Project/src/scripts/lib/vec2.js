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
}