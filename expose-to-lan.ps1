# PowerShell script to expose PasteParty port to LAN
# Run this script as Administrator

param(
    [Parameter(Mandatory=$false)]
    [switch]$Remove = $false,
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 8081
)

$ErrorActionPreference = "Stop"

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$RuleName = "PasteParty - Port $Port"
$RuleDescription = "Allow PasteParty application to accept connections on port $Port"

if ($Remove) {
    Write-Host "🗑️ Removing firewall rule..." -ForegroundColor Yellow
    
    # Check if rule exists
    $existingRule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Remove-NetFirewallRule -DisplayName $RuleName
        Write-Host "✅ Firewall rule removed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Firewall rule not found" -ForegroundColor Yellow
    }
    
    # Also remove the inbound rule if it exists
    try {
        $inboundRule = Get-NetFirewallRule -DisplayName $RuleName -Direction Inbound -ErrorAction SilentlyContinue
        if ($inboundRule) {
            Remove-NetFirewallRule -DisplayName $RuleName -Direction Inbound
        }
    } catch {
        # Ignore errors
    }
    
} else {
    Write-Host "🔧 Configuring Windows Firewall to expose PasteParty on port $Port..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if rule already exists
    $existingRule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "⚠️ Firewall rule already exists. Removing old rule..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
    }
    
    # Create inbound firewall rule
    try {
        New-NetFirewallRule -DisplayName $RuleName `
            -Description $RuleDescription `
            -Direction Inbound `
            -Protocol TCP `
            -LocalPort $Port `
            -Action Allow `
            -Profile Domain,Private `
            -Enabled True | Out-Null
        
        Write-Host "✅ Firewall rule created successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Get local IP address
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
        
        Write-Host "📡 PasteParty is now accessible on your LAN:" -ForegroundColor Cyan
        Write-Host "   Local:   http://localhost:${Port}" -ForegroundColor White
        if ($localIP) {
            Write-Host "   Network: http://${localIP}:${Port}" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "⚠️ Note: This only configures Windows Firewall." -ForegroundColor Yellow
        Write-Host "   If you have other firewall software, you may need to configure it separately." -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ Failed to create firewall rule: $_" -ForegroundColor Red
        exit 1
    }
}

