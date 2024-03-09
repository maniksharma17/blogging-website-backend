import { Hono } from 'hono'
import { cors } from 'hono/cors' 
const app = new Hono().basePath('/api/v1')

import userRouter from './routes/user'
import blog from './routes/blog'

app.use('/*', cors())
app.route('/blog', blog)
app.route('/user', userRouter)


export default app
