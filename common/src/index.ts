import z from 'zod';

export const userSignupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export type userSignupSchema = z.infer<typeof userSignupSchema>;

export const userSigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type userSigninSchema = z.infer<typeof userSigninSchema>;

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string(),
    publication: z.boolean()
})

export type createPostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    publication: z.boolean().optional()
});

export type updatePostSchema = z.infer<typeof updatePostSchema>;