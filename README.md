# 테스트 설문 페이지

React CDN과 Vercel Functions를 사용한 임시 설문 테스트 페이지입니다.

## 로컬에서 보기

`index.html` 파일을 브라우저로 열면 됩니다.

## GitHub에 올리기

```powershell
cd D:\Codex_git\survey-test
git init
git add .
git commit -m "Add test survey page"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

## Vercel 배포

1. Vercel에 GitHub 계정으로 로그인합니다.
2. `New Project`에서 GitHub 저장소를 선택합니다.
3. Framework Preset은 `Other`로 둡니다.
4. Build Command는 비워둡니다.
5. Output Directory도 비워둡니다.
6. Vercel Marketplace에서 Postgres 데이터베이스를 추가합니다.
7. 프로젝트 Environment Variables에 `ADMIN_TOKEN`을 추가합니다.
8. Deploy를 누릅니다.

계정 비밀번호나 토큰은 이 프로젝트 파일에 저장하지 마세요.

## 응답 저장

응답은 Vercel Function `/api/submit`을 통해 Postgres 테이블 `survey_responses`에 저장됩니다.

필요한 환경변수:

- `DATABASE_URL`: Vercel Marketplace Postgres 연결 시 자동으로 주입됩니다.
- `ADMIN_TOKEN`: 관리자 조회 API 보호용 비밀 문자열입니다.

## 응답 확인

배포 후 아래처럼 호출하면 최근 응답 500개를 JSON으로 확인할 수 있습니다.

```powershell
$token = "Vercel에 설정한 ADMIN_TOKEN"
Invoke-RestMethod `
  -Uri "https://배포주소.vercel.app/api/responses" `
  -Headers @{ Authorization = "Bearer $token" }
```
