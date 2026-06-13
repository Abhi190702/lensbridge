param(
    [string]$DriverPath = $PSScriptRoot,
    [string]$CameraName = "LensBridge Camera"
)

$ErrorActionPreference = "Stop"

function Assert-Administrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Run this script from an Administrator PowerShell window."
    }
}

function Invoke-RegSvr32 {
    param(
        [string]$RegSvr32,
        [string]$DllPath
    )

    if (-not (Test-Path -LiteralPath $DllPath)) {
        throw "Missing driver DLL: $DllPath"
    }

    Unblock-DriverDll -DllPath $DllPath

    # UnityCapture's upstream installer registers the filter without a DllInstall payload.
    # The LensBridge friendly name is applied afterward by updating the registered filter names.
    $process = Start-Process -FilePath $RegSvr32 -ArgumentList @("/s", "`"$DllPath`"") -Wait -PassThru -WindowStyle Hidden
    if ($process.ExitCode -ne 0) {
        $message = @(
            "regsvr32 failed for $DllPath with exit code $($process.ExitCode).",
            "Try these fixes:",
            "1. Confirm this PowerShell window is running as Administrator.",
            "2. Install Microsoft Visual C++ 2015-2022 Redistributable for x64 and x86.",
            "3. Keep the repo in a local, fully synced folder; OneDrive cloud-only files cannot be registered.",
            "4. Run: Unblock-File -LiteralPath `"$DllPath`""
        ) -join [Environment]::NewLine
        throw $message
    }
}

function Unblock-DriverDll {
    param([string]$DllPath)

    try {
        $zone = Get-Item -LiteralPath $DllPath -Stream Zone.Identifier -ErrorAction SilentlyContinue
        if ($zone) {
            Write-Host "Removing downloaded-file block from $([IO.Path]::GetFileName($DllPath))..."
            Unblock-File -LiteralPath $DllPath
        }
    } catch {
        Write-Warning "Could not remove downloaded-file block from $DllPath. $($_.Exception.Message)"
    }
}

function Set-FilterNames {
    param([string]$Name)

    $clsids = @(
        "{5C2CD55C-92AD-4999-8666-912BD3E70010}",
        "{5C2CD55C-92AD-4999-8666-912BD3E70020}"
    )
    $category = "{860BB310-5D01-11D0-BD3B-00A0C911CE86}"

    foreach ($clsid in $clsids) {
        $classPaths = @(
            "HKLM:\SOFTWARE\Classes\CLSID\$clsid",
            "HKLM:\SOFTWARE\Classes\WOW6432Node\CLSID\$clsid"
        )

        foreach ($path in $classPaths) {
            if (Test-Path -LiteralPath $path) {
                Set-ItemProperty -LiteralPath $path -Name "(default)" -Value $Name -ErrorAction SilentlyContinue
            }
        }

        $instancePaths = @(
            "HKLM:\SOFTWARE\Classes\CLSID\$category\Instance\$clsid",
            "HKLM:\SOFTWARE\Classes\WOW6432Node\CLSID\$category\Instance\$clsid"
        )

        foreach ($path in $instancePaths) {
            if (Test-Path -LiteralPath $path) {
                Set-ItemProperty -LiteralPath $path -Name "FriendlyName" -Value $Name -ErrorAction SilentlyContinue
            }
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

Write-Host "LensBridge Camera driver installation" -ForegroundColor Cyan
Assert-Administrator

$resolvedDriverPath = (Resolve-Path -LiteralPath $DriverPath).Path
$dll64 = Join-Path $resolvedDriverPath "UnityCaptureFilter64.dll"
$dll32 = Join-Path $resolvedDriverPath "UnityCaptureFilter32.dll"

Write-Host "Registering 64-bit DirectShow filter as '$CameraName'..."
Invoke-RegSvr32 -RegSvr32 "$env:SystemRoot\System32\regsvr32.exe" -DllPath $dll64

if ([Environment]::Is64BitOperatingSystem -and (Test-Path -LiteralPath $dll32)) {
    Write-Host "Registering 32-bit DirectShow filter for legacy apps..."
    Invoke-RegSvr32 -RegSvr32 "$env:SystemRoot\SysWOW64\regsvr32.exe" -DllPath $dll32
}

Set-FilterNames -Name $CameraName

$appDataPath = Join-Path $env:APPDATA "LensBridge"
New-Item -ItemType Directory -Force -Path $appDataPath | Out-Null
[pscustomobject]@{
    cameraName = $CameraName
    driverPath = $resolvedDriverPath
    installedAt = (Get-Date).ToString("o")
    bridge = "UnityCapture DirectShow shared memory"
} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $appDataPath "driver-install.json") -Encoding UTF8

Send-DeviceChangeBroadcast

Write-Host ""
Write-Host "Installation complete." -ForegroundColor Green
Write-Host "Restart Chrome, then select '$CameraName' from the camera picker."
Write-Host "Keep LensBridge Desktop running and your phone connected before opening the camera."
