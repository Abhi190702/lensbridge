param(
    [string]$DriverPath = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

function Assert-Administrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Run this script from an Administrator PowerShell window."
    }
}

function Unregister-Filter {
    param(
        [string]$RegSvr32,
        [string]$DllPath
    )

    if (Test-Path -LiteralPath $DllPath) {
        & $RegSvr32 /s /u $DllPath
        if ($LASTEXITCODE -ne 0) {
            throw "regsvr32 unregister failed for $DllPath with exit code $LASTEXITCODE"
        }
    }
}

function Send-DeviceChangeBroadcast {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class LensBridgeDeviceBroadcast {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SendMessageTimeout(
        IntPtr hWnd,
        uint Msg,
        IntPtr wParam,
        IntPtr lParam,
        uint fuFlags,
        uint uTimeout,
        out IntPtr lpdwResult);
}
"@ -ErrorAction SilentlyContinue

    $result = [IntPtr]::Zero
    [LensBridgeDeviceBroadcast]::SendMessageTimeout([IntPtr]0xffff, 0x0219, [IntPtr]::Zero, [IntPtr]::Zero, 2, 1000, [ref]$result) | Out-Null
}

Write-Host "LensBridge Camera driver removal" -ForegroundColor Cyan
Assert-Administrator

$resolvedDriverPath = (Resolve-Path -LiteralPath $DriverPath).Path
$dll64 = Join-Path $resolvedDriverPath "UnityCaptureFilter64.dll"
$dll32 = Join-Path $resolvedDriverPath "UnityCaptureFilter32.dll"

Write-Host "Unregistering 64-bit DirectShow filter..."
Unregister-Filter -RegSvr32 "$env:SystemRoot\System32\regsvr32.exe" -DllPath $dll64

if ([Environment]::Is64BitOperatingSystem) {
    Write-Host "Unregistering 32-bit DirectShow filter..."
    Unregister-Filter -RegSvr32 "$env:SystemRoot\SysWOW64\regsvr32.exe" -DllPath $dll32
}

$installInfo = Join-Path $env:APPDATA "LensBridge\driver-install.json"
if (Test-Path -LiteralPath $installInfo) {
    Remove-Item -LiteralPath $installInfo -Force
}

Send-DeviceChangeBroadcast

Write-Host ""
Write-Host "Removal complete." -ForegroundColor Green
Write-Host "Restart Chrome or any app that had the camera picker open."
