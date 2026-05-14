import { neon } from "@neondatabase/serverless";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "GET 요청만 가능합니다." });
  }

  if (!process.env.ADMIN_TOKEN) {
    return response.status(500).json({
      error: "ADMIN_TOKEN 환경변수가 설정되지 않았습니다.",
    });
  }

  const authHeader = request.headers.authorization ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (token !== process.env.ADMIN_TOKEN) {
    return response.status(401).json({ error: "인증이 필요합니다." });
  }

  if (!process.env.DATABASE_URL) {
    return response.status(500).json({
      error: "DATABASE_URL 환경변수가 설정되지 않았습니다.",
    });
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      favorite_number INTEGER NOT NULL,
      location TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const rows = await sql`
    SELECT id, name, favorite_number, location, created_at
    FROM survey_responses
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return response.status(200).json({ responses: rows });
}
