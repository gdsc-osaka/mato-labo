import z from "zod";

const memberSchema = z.object({
    name: z.string(),
    name_en: z.string().nullable(),
    position: z.string(),
    position_en: z.string().nullable(),
    email: z.string().nullable()
});
const membersSchema = z.array(memberSchema);

export const membersDataSchema = z.object({
    staff: membersSchema,
    student: membersSchema
})

export type Member = z.infer<typeof memberSchema>;
export type MemberData = z.infer<typeof membersDataSchema>;

export const accessSchema = z.object({
    post_code: z.string(),
    address: z.string(),
    tel_number: z.string(),
    fax: z.string().nullable(),
    access: z.array(z.string())
});

export type Access = z.infer<typeof accessSchema>;
