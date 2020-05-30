class RectCollider
{
    constructor (obj)
    {
        obj.setCollider(this);
        this.obj = obj;
        this.positions = [
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0,
        ];
        this.previousPosition = this.copyPos(this.obj.getPosition());
    }
    getObject()
    {
        return this.obj;
    }
    updatePosition()
    {
        this.previousPosition = this.copyPos(this.obj.getPosition());
    }
    getVertex (n)
    {
        const width = this.obj.getScale()[0];
        const height = this.obj.getScale()[1];
        const ret = [this.positions[2 * n] * width + this.obj.getPosition()[0], this.positions[2 * n + 1] * height + this.obj.getPosition()[1]];
        return ret;
    }
    getPreviousVertex (n)
    {
        const width = this.obj.getScale()[0];
        const height = this.obj.getScale()[1];
        const ret = [this.positions[2 * n] * width + this.previousPosition[0], this.positions[2 * n + 1] * height + this.previousPosition[1]];
        return ret;
    }

    checkCollision (e)
    {
        var n1 = 0;
        var n2 = 0;
        var ground = false;

        if (e.isHorizontal())
        {
            if (e.getV1()[0] - e.getV2()[0] > 0)
            {
                n1 = 0;
                n2 = 1;
                ground = true;
            }
            else
            {
                n1 = 2;
                n2 = 3;
            }
        }
        else
        {
            if (e.getV1()[1] - e.getV2()[1] > 0)
            {
                n1 = 1;
                n2 = 3;
            }
            else
            {
                n1 = 0;
                n2 = 2;
            }
        }

        const checkn1 = this.checkCollisionPoint(e, n1);
        const checkn2 = this.checkCollisionPoint(e, n2);

        if (checkn1 || checkn2)
        {
            return ground;
        }
        return false;
    }
    checkCollisionPoint(e, n)
    {
        const src = this.getPreviousVertex(n);
        const dst = this.getVertex(n);
        const mov = new Edge(src, dst);
        const tolerance = 0.1;
        if (e.isIn(mov.getV1(), tolerance) || (!e.isIn(mov.getV2(), tolerance)))
        {
            return false;
        }
        if (mov.isIn(e.getV1(), tolerance) == mov.isIn(e.getV2(), tolerance))
        {
            return false;
        }
        if (e.isHorizontal())
        {
            const x1 = e.getV1()[0];
            const x2 = e.getV2()[0];
            const y1 = e.getV1()[1];
            const y2 = e.getV2()[1];
            const x = dst[0];
            const y = dst[1];

            var newY = y2;
            if (x2 - x1 != 0.0)
            {
                newY = this.fit(y1, y2, (y2 - y1) / (x2 - x1) * (x - x1) + y1);
            }

            this.obj.translate([0.0, newY - y, 0.0, 0.0]);
        }
        else
        {
            const x1 = e.getV1()[0];
            const x2 = e.getV2()[0];
            const y1 = e.getV1()[1];
            const y2 = e.getV2()[1];
            const x = dst[0];
            const y = dst[1];

            var newX = x2;
            if (y2 - y1 != 0.0)
            {
                newX = this.fit(x1, x2, (x2 - x1) / (y2 - y1) * (y - y1) + x1);
            }

            this.obj.translate([newX - x, 0.0, 0.0, 0.0]);
        }
        return true;
    }

    fit(b1, b2, v)
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

    copyPos(array)
    {
        const l = array.length;
        const ret = [];
        for (let i = 0; i < l; i++)
        {
            ret.push(array[i]);
        }
        return ret;
    }
}