declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                NODE_ENV?: string;
                DATABASE_URL: string; // Session URI ("postgres://postgres.[id]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true&sslmode=require")
                DIRECT_URL: string; // Transaction URI ("postgres://postgres.[id]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres")
                GOOGLE_CLIENT_ID: string;
                GOOGLE_CLIENT_SECRET: string;
                URL: string; // ウェブサイトが動いてるURL (etc: http://localhost:3000/)
                AI_API_KEY: string; // https://aistudio.google.com/app/apikey
            }
        }
    }
}
