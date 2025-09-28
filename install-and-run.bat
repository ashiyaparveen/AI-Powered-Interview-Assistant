@echo off
echo Installing AI Interview Assistant...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Installation complete! Starting the application...
echo.
echo The application will open in your browser at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
