class bitmap
{
    static create(size, value)
    {
        const ret = [];
        for (let i = 0; i < size; i++)
        {
            ret.push(value);
        }
        return ret;
    }
    static fill(bm, value)
    {
        for (let i = 0; i < bm.length; i++)
        {
            bm[i] = value;
        }
    }
    static first_true(bm)
    {
        for (let i = 0; i < bm.length; i++)
        {
            if (bm[i])
            {
                return i;
            }
        }
        return -1;
    }
    static pickAndSet(bm)
    {
        for (let i = 0; i < bm.length; i++)
        {
            if (bm[i])
            {
                bm[i] = false;
                return i;
            }
        }
        return -1;
    }
    static setAt(bm, idx, value)
    {
        if (bm.length <= idx)
        {
            console.log("Error at bitmap function setAt() : out of bounds");
            return;
        }
        bm[idx] = value;
    }
}