import z from "zod";

const memberSchema = z.object({
    name_ja: z.string().nullable(),
    name_en: z.string().nullable(),
    position_ja: z.string().nullable(),
    position_en: z.string().nullable(),
    email: z.string().nullable()
});
const membersSchema = z.array(memberSchema);

export const membersDataSchema = z.object({
    staff: membersSchema.nullable(),
    student: membersSchema.nullable()
})

export type Member = z.infer<typeof memberSchema>;
export type MemberData = z.infer<typeof membersDataSchema>;

export const accessSchema = z.object({
    post_code: z.string().nullable(),
    address: z.string().nullable(),
    tel_number: z.string().nullable(),
    fax: z.string().nullable(),
    access: z.array(z.string()).nullable()
});

export type Access = z.infer<typeof accessSchema>;

export const abstractSchema = z.object({
    summary_ja: z.string(),
    summary_en: z.string()
});
