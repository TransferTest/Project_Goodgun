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
        this.previousPositions = this.copyPos(this.positions);
    }
    updatePosition()
    {
        this.previousPositions = this.copyPos(this.positions);
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
        const ret = [this.previousPositions[2 * n] * width + this.obj.getPosition()[0], this.previousPositions[2 * n + 1] * height + this.obj.getPosition()[1]];
        return ret;
    }

    checkCollision (e)
    {
        let n1 = 0;
        let n2 = 0;

        if (e.isHorizontal())
        {
            if (e.getV1()[0] - e.getV2()[0] > 0)
            {
                n1 = 0;
                n2 = 1;
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
                n1 = 0;
                n2 = 2;
            }
            else
            {
                n1 = 1;
                n2 = 3;
            }
        }

        if (checkCollisionPoint(e, n1))
        {
            console.log("col!!!");
        }
        if (checkCollisionPoint(e, n2))
        {
            console.log("col!!!");
        }
    }
    checkCollisionPoint(e, n)
    {
        const mov = new Edge(this.getPreviousVertex(n), this.getVertex(n));
        return Edge.intersect(e, mov);
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