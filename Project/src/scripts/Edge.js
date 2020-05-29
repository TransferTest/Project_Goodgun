class Edge
{
    constructor (v1, v2, dir)
    {
        this.v1 = v1;
        this.v2 = v2;
        this.dir = dir;
    }
    isHorizontal()
    {
        return dir;
    }
    isIn(v, tolerance)
    {
        const x = v[0];
        const y = v[1];
        const x1 = this.v1[0];
        const y1 = this.v1[1];
        const x2 = this.v2[0];
        const y2 = this.v2[1];
        const t = tolerance;

        const det = (y2 - y1) * (x - x1 - t) - (x2 - x1) * (y - y1 + t);
        return (det < 0);
    }
    getV1 ()
    {
        return this.v1;
    }
    getV2 ()
    {
        return this.v2;
    }
    static fit(b1, b2, v)
    {
        let ret = v;
        let min = b1;
        let max = b2;
        if (b1 > b2)
        {
            min = b2;
            max = b1;
        }
        if (ret > max)
        {
            ret = max;
        }
        if (ret < min)
        {
            ret = min;
        }
        return ret;
    }
    static intersect (e1, e2)
    {
        if (e1.isIn(e2.getV1()) == e1.isIn(e2.getV2()))
        {
            return false;
        }
        if (e2.isIn(e1.getV1()) == e2.isIn(e1.getV2()))
        {
            return false;
        }
        return true;
    }
}