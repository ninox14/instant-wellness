$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendDir = Join-Path $RootDir "apps\back-end"

Write-Host "Installing dependencies..."
pnpm install

Write-Host "Building all packages..."
pnpm build

Write-Host "Applying DB migrations..."
Set-Location $BackendDir

pnpm db:migrate:prod

Write-Host "Running seed script..."
pnpm db:seed:prod

Write-Host "Done"