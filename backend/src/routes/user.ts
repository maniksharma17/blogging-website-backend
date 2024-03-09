import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { userSignupSchema, userSigninSchema } from '@maniksharma17/common' 

const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
        JWT_SECRET: string
	},
    Variables: {
        id: string
    }
}>()

userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();
    console.log(body)
    console.log((userSignupSchema.safeParse(body).success))
    
    if (!(userSignupSchema.safeParse(body).success)){

        return c.json({
            error: userSignupSchema.safeParse(body).error.issues[1].message 
        })
    }
    

    const existingUser = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    })

    if (existingUser){
        return c.json({
            error: "User already registered!"
        })
    }

    try{
        const userCreated = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })
    
        const token = await sign(
            {id: userCreated.id},
            c.env.JWT_SECRET
        )
            
        c.status(200)
        return c.json({
            message: "User signed up!",
            token: token,
            id: userCreated.id
        })

    } catch(e){
        c.status(403)
        return c.json({
            error: "Some error occured"
        })
    }
    
})

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl:  c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    console.log(userSigninSchema.safeParse(body))
    if (!(userSigninSchema.safeParse(body).success)){
        return c.json({
            error: userSignupSchema.safeParse(body).error.issues[1].message       
        })
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: body.email,
            password: body.password
        }
    })
    

    try{
        if (existingUser){
            const token = await sign(
                existingUser.id,
                c.env.JWT_SECRET
            )
               
            c.status(200)
            return c.json({
                message: "User logged in!",
                token: token,
                id: existingUser.id
            })
        } else {
            return c.json({
                error: "Incorrect username / password"
            })
        }
    } catch(e){
        c.status(403)
        return c.json({
            message: "Some error!"
        })
    }
    
})

userRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:  c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id')

    const userData = await prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            posts: true
        }
    })

    return c.json(userData)
})

export default userRouter