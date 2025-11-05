# PowerShell script to install PasteParty as a Windows Service
# Run this script as Administrator

param(
    [Parameter(Mandatory=$false)]
    [switch]$Uninstall = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Start = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Stop = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Status = $false
)

$ErrorActionPreference = "Stop"

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$ServiceName = "PasteParty"
$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodePath = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $NodePath) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "📍 Project Path: $ProjectPath" -ForegroundColor Cyan
Write-Host "📦 Node.js Path: $NodePath" -ForegroundColor Cyan
Write-Host ""

# Create service installation script
$serviceScript = @"
const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: '$ServiceName',
    description: 'PasteParty - Clipboard paste application web server',
    script: path.join(__dirname, 'server.js'),
    nodeOptions: [],
    env: [
        {
            name: 'NODE_ENV',
            value: 'production'
        }
    ]
});

svc.on('install', function() {
    console.log('✅ Service installed successfully!');
    console.log('Starting service...');
    svc.start();
});

svc.on('start', function() {
    console.log('✅ Service started successfully!');
    console.log('PasteParty is now running as a Windows service.');
    console.log('Access it at: http://localhost:8081');
});

svc.on('error', function(err) {
    console.error('❌ Service error:', err);
});

if (process.argv[2] === 'install') {
    svc.install();
} else if (process.argv[2] === 'uninstall') {
    svc.uninstall();
} else if (process.argv[2] === 'start') {
    svc.start();
} else if (process.argv[2] === 'stop') {
    svc.stop();
} else if (process.argv[2] === 'restart') {
    svc.restart();
} else {
    console.log('Usage: node install-service.js [install|uninstall|start|stop|restart]');
}
"@

$serviceScriptPath = Join-Path $ProjectPath "install-service.js"
$serviceScript | Out-File -FilePath $serviceScriptPath -Encoding UTF8

# Install node-windows if not already installed
Write-Host "📦 Checking for node-windows package..." -ForegroundColor Yellow
Push-Location $ProjectPath

try {
    $nodeWindowsCheck = npm list node-windows 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $nodeWindowsCheck) {
        Write-Host "📦 Installing node-windows package..." -ForegroundColor Yellow
        npm install node-windows --save-dev
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install node-windows" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ node-windows installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ node-windows already installed" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error checking/installing node-windows: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Handle different actions
if ($Uninstall) {
    Write-Host "🗑️ Uninstalling service..." -ForegroundColor Yellow
    node $serviceScriptPath uninstall
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Service uninstalled successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to uninstall service" -ForegroundColor Red
    }
} elseif ($Start) {
    Write-Host "▶️ Starting service..." -ForegroundColor Yellow
    node $serviceScriptPath start
} elseif ($Stop) {
    Write-Host "⏹️ Stopping service..." -ForegroundColor Yellow
    node $serviceScriptPath stop
} elseif ($Status) {
    Write-Host "📊 Checking service status..." -ForegroundColor Yellow
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "Service Name: $($service.Name)" -ForegroundColor Cyan
        Write-Host "Display Name: $($service.DisplayName)" -ForegroundColor Cyan
        Write-Host "Status: $($service.Status)" -ForegroundColor $(if ($service.Status -eq 'Running') { 'Green' } else { 'Yellow' })
        Write-Host "Start Type: $($service.StartType)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Service not found. Install it first using: .\install-service.ps1" -ForegroundColor Red
    }
} else {
    # Default: Install service
    Write-Host "🔧 Installing PasteParty as Windows Service..." -ForegroundColor Yellow
    Write-Host ""
    node $serviceScriptPath install
    
    Write-Host ""
    Write-Host "🎉 Installation complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Management Commands:" -ForegroundColor Yellow
    Write-Host "  .\install-service.ps1           - Install service" -ForegroundColor White
    Write-Host "  .\install-service.ps1 -Start     - Start service" -ForegroundColor White
    Write-Host "  .\install-service.ps1 -Stop      - Stop service" -ForegroundColor White
    Write-Host "  .\install-service.ps1 -Status    - Check service status" -ForegroundColor White
    Write-Host "  .\install-service.ps1 -Uninstall - Uninstall service" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use Windows Services (services.msc) to manage the service" -ForegroundColor Cyan
}

Pop-Location

