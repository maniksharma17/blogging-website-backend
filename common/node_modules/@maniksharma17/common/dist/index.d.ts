import z from 'zod';
export declare const userSignupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type userSignupSchema = z.infer<typeof userSignupSchema>;
export declare const userSigninSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type userSigninSchema = z.infer<typeof userSigninSchema>;
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    publication: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    publication: boolean;
}, {
    title: string;
    content: string;
    publication: boolean;
}>;
export type createPostSchema = z.infer<typeof createPostSchema>;
export declare const updatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    publication: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    publication?: boolean | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    publication?: boolean | undefined;
}>;
export type updatePostSchema = z.infer<typeof updatePostSchema>;
