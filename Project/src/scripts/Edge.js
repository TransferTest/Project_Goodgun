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
        return this.dir;
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

        var tx = t;
        var ty = t;

        if (y2 - y1 > 0)
        {
            tx = -t;
        }
        if (x2 - x1 > 0)
        {
            ty = -t;
        }

        if (this.isHorizontal())
        {
            tx = 0.0;
        }
        else
        {
            ty = 0.0;
        }

        const det = (y2 - y1) * (x - x1 - tx) - (x2 - x1) * (y - y1 + ty);
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
    static intersect (e1, e2)
    {
        if (e1.isIn(e2.getV1(), 0.0) == e1.isIn(e2.getV2(), 0.0))
        {
            return false;
        }
        if (e2.isIn(e1.getV1(), 0.0) == e2.isIn(e1.getV2(), 0.0))
        {
            return false;
        }
        return true;
    }
}