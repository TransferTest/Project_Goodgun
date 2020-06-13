class Spine
{
    constructor(n)
    {
        this.parent = null;
        this.childs = [];
        this.id = n;
        this.transform = vec2.createZero();
        this.rotation = 0.0;
        this.joint_transform = vec2.createZero();
        this.joint_rotation = 0.0;
        this.a_pose_root_position = vec2.createZero();
    }
    compareId(id)
    {
        return (this.id == id);
    }
    setParent(parent)
    {
        this.parent = parent;
    }
    setRootPosition(pos)
    {
        this.a_pose_root_position = pos;
    }
    getRootPosition()
    {
        return this.a_pose_root_position;
    }
    initJointTransform()
    {
        if (this.parent === null)
        {
            this.joint_transform = vec2.copy(this.a_pose_root_position);
            return;
        }
        this.joint_transform = vec2.sub(this.getRootPosition(), this.parent.getRootPosition());
    }
    setTransform(transform)
    {
        this.transform = transform;
    }
    getTransform()
    {
        return this.transform;
    }
    getJointTransform()
    {
        return this.joint_transform;
    }
    setRotation(rotation)
    {
        this.rotation = rotation;
    }
    getRotation()
    {
        return this.rotation;
    }
    setJointRotation(rotation)
    {
        this.joint_rotation = rotation;
    }
    getJointRotation()
    {
        return this.joint_rotation;
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
        if (this.parent === null)
        {
            return;
        }
        this.parent.removeChild(this.id);
    }
    propagate()
    {
        this.propagate_iter(vec2.createZero(), 0.0);
    }
    propagate_iter(parent_transform, parent_rotation)
    {
        const rotation_matrix = mat2.createRotation(parent_rotation);

        this.setRotation(parent_rotation + this.getJointRotation());
        this.setTransform(vec2.add(parent_transform, vec2.mmul(rotation_matrix, this.getJointTransform())));

        for (let i = 0; i < this.childs.length; i++)
        {
            this.childs[i].propagate_iter(this.getTransform(), this.getRotation());
        }
    }
}