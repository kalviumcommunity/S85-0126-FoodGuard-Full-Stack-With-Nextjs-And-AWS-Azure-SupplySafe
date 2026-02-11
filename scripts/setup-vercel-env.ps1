# Setup Vercel Environment Variables
Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green

# Database
Write-Host "`nAdding DATABASE_URL..." -ForegroundColor Yellow
"postgresql://postgres:gargmadhav123@db.mdrqntpedztxxfcxsbxk.supabase.co:5432/postgres" | vercel env add DATABASE_URL production

# Supabase
Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
"https://mdrqntpedztxxfcxsbxk.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

Write-Host "`nAdding SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyNjEwMiwiZXhwIjoyMDg2MjAyMTAyfQ.nzj4jpRmUuc-Tfi1O99HuX9VxiU_Z6mhlOPKPrRHXwc" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# JWT Secrets
Write-Host "`nAdding JWT_SECRET..." -ForegroundColor Yellow
"super_secure_secret_min_32_characters_long" | vercel env add JWT_SECRET production

Write-Host "`nAdding REFRESH_SECRET..." -ForegroundColor Yellow
"super_secure_refresh_secret_min_32_characters_long" | vercel env add REFRESH_SECRET production

Write-Host "`nAdding SESSION_SECRET..." -ForegroundColor Yellow
"your_session_secret_min_32_characters_long" | vercel env add SESSION_SECRET production

Write-Host "`n✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host "Now run: vercel --prod" -ForegroundColor Cyan
