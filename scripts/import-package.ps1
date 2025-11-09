param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$PackagePath
)

if (-not (Test-Path -LiteralPath $PackagePath)) {
    Write-Error "Package file not found: $PackagePath"
    exit 1
}

$packageContent = Get-Content -LiteralPath $PackagePath -Raw
$pattern = '(?s)```file=([^\r\n]+)\r?\n(.*?)```'
$matches = [regex]::Matches($packageContent, $pattern)

if ($matches.Count -eq 0) {
    Write-Error "No \`\`\`file=...\`\`\` blocks were found in $PackagePath"
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir

foreach ($match in $matches) {
    $relativePath = $match.Groups[1].Value.Trim()
    $content = $match.Groups[2].Value
    $targetPath = Join-Path -Path $repoRoot -ChildPath $relativePath
    $targetDir = Split-Path -Parent $targetPath
    if ($targetDir -and -not (Test-Path -LiteralPath $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Set-Content -LiteralPath $targetPath -Value $content -Encoding UTF8
    Write-Host "Wrote $relativePath"
}
