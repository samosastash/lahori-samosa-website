@echo off
echo 🚀 Deploying Lahori Samosa Website...
echo.

echo 📦 Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo 📁 Build files ready in 'build' folder:
dir build /b
echo.

echo 🌐 Ready for deployment to lahorisamosa.shop
echo.
echo Next steps:
echo 1. Upload the contents of 'build' folder to your web server
echo 2. Make sure server.js is also uploaded
echo 3. Run 'npm install' on your server
echo 4. Start the server with 'npm start'
echo.

echo 🧪 Test the payment flow after deployment!
echo.

pause
