import { neon } from "@neondatabase/serverless";

function cleanText(value) {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

function isValidFavoriteNumber(value) {
  return typeof value === "string" && /^[0-9]$/.test(value);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    return response.status(500).json({
      error: "DATABASE_URL 또는 POSTGRES_URL 환경변수가 설정되지 않았습니다.",
    });
  }

  const body = request.body ?? {};
  const name = cleanText(body.name);
  const favoriteNumber = cleanText(body.favoriteNumber);
  const location = cleanText(body.location);

  if (!name || !isValidFavoriteNumber(favoriteNumber) || !location) {
    return response.status(400).json({
      error: "이름, 좋아하는 숫자, 사는 곳을 모두 입력해 주세요.",
    });
  }

  const sql = neon(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      favorite_number INTEGER NOT NULL,
      location TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const [saved] = await sql`
    INSERT INTO survey_responses (name, favorite_number, location)
    VALUES (${name}, ${Number(favoriteNumber)}, ${location})
    RETURNING id, created_at
  `;

  return response.status(201).json({
    ok: true,
    id: saved.id,
    createdAt: saved.created_at,
  });
}
