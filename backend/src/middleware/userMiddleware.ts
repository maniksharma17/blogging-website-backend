import { verify } from "hono/jwt"; 

export default async function userMiddleware(c: any, next: Function){
    const header = c.req.header('Authorization');
    console.log(header)
    const token = header.split(' ')[1]

    try {
        const tokenVerification = await verify(token, c.env.JWT_SECRET)
        if (tokenVerification){
            c.status(200)
            c.set('id', tokenVerification)
            await next()
        }
    } catch (e){
        c.status(403)
        return c.json({
            message: "Not authorized."
        })
    }
}