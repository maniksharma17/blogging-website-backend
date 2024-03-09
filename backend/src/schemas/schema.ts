const zod = require('zod')

export const userSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6)
})

export const blogSchema = zod.object({
    title: zod.string(),
    content: zod.string().email(),
    publication: zod.boolean()
})

