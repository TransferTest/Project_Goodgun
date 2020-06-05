class Spine
{
    constructor(n)
    {
        this.parent = null;
        this.childs = [];
        this.id = n;
        this.transform = vec2.createZero();
        this.ratation = 0.0;
    }
    compareId(id)
    {
        return (this.id == id);
    }
    setParent(parent)
    {
        this.parent = parent;
    }
    setTransform(transform)
    {
        this.transform = transform;
    }
    getTransform()
    {
        return this.transform;
    }
    setRotation(rotation)
    {
        this.rotation = rotation;
    }
    getRotation()
    {
        return this.rotation;
    }

    getRotationMatrix()
    {
        return mat4.createRotation(this.rotation);
    }
    findChild(id)
    {
        for (let i = 0; i < this.childs.length; i++)
        {
            const c = this.childs[i];
            if (c.compareId(id))
            {
                return c;
            }
        }
        return null;
    }
    removeParent()
    {
        this.parent = null;
    }
    removeChild(id)
    {
        for (let i = 0; i < this.childs.length; i++)
        {
            const c = this.childs[i];
            if (c.compareId(id))
            {
                c.removeParent();
                this.childs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    remove()
    {
        for (let i = 0; i < this.childs.length; i++)
        {
            this.childs[i].removeParent();
        }
        this.parent.removeChild(this.id);
    }
}