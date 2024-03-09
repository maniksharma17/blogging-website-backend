import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import userMiddleware from '../middleware/userMiddleware'
import { createPostSchema, updatePostSchema } from '@maniksharma17/common'

const blog = new Hono<{
	Bindings: {
		DATABASE_URL: string,
	}
    Variables: {
        id: string
    }
}>()

blog.use('/*', userMiddleware)

blog.post('/post', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = createPostSchema.safeParse(body)
    
    if (!success){
        c.status(411)
        return c.json({
            message: "Invalid inputs"
        })
    }

    await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            draft: body.draft,
            authorID: c.get('id'),
        }
    })

    return c.json({
        message: "Post created.",
    })


})

blog.delete('/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    const blogId = await c.req.param('id')

    await prisma.post.delete({
        where: {
            id: blogId,
        }
    })

    return c.json({
        message: "Post deleted.",
    })
})

blog.get('/bulk', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const filter = c.req.query('filter') || ""
    
    const posts = await prisma.post.findMany({
        where: {
            title: { contains: filter, mode: 'insensitive' },
        },
        include: {
            author: {
                select : {name: true}
            }
        }
    })

    return c.json(posts)
})

blog.get('/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const postID = await c.req.param('id')

    const postData = await prisma.post.findUnique({
        where: {
            id: postID
        },
        include: {
            author: {
                select: { name: true }
            }
        }
    })

    return c.json(postData)
})


export default blog