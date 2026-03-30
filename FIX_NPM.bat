@echo off
echo ========================================
echo NPM Install Sorunu Cozumu
echo ========================================
echo.

echo ONEMLI: Tum calisir servislari kapat!
echo - npm run dev
echo - prisma studio
echo - VSCode terminalleri
echo.
pause

echo.
echo node_modules siliniyor...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo node_modules silindi.
) else (
    echo node_modules zaten yok.
)

echo.
echo package-lock.json siliniyor...
if exist "package-lock.json" (
    del /f "package-lock.json"
    echo package-lock.json silindi.
)

echo.
echo Temiz npm install yapiliyor...
npm install

echo.
echo ========================================
echo Kurulum Tamamlandi!
echo ========================================
echo.
echo Simdi development server baslatabilirsin:
echo npm run dev
echo.
pause
