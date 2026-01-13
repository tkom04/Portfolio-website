# Download NASA Solar System GLTF Models
# Based on NASA's 3D model repository

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# NASA GLTF model URLs (these are the direct download links from NASA's 3D model pages)
$nasaModels = @{
    "sun" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
}

Write-Host "Downloading NASA Solar System Models..." -ForegroundColor Cyan
Write-Host ""

# Download Sun (already have the URL)
$sunFile = Join-Path $outputDir "sun_nasa.glb"
if (-not (Test-Path $sunFile)) {
    Write-Host "Downloading Sun..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $nasaModels["sun"] -OutFile $sunFile -UseBasicParsing
        Write-Host "  ✓ Downloaded Sun" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to download Sun: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ✓ Sun already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Note: To download other planets, visit:" -ForegroundColor Cyan
Write-Host "  https://solarsystem.nasa.gov/resources/ and search for each planet's 3D model"
Write-Host ""
Write-Host "Or use NASA's API endpoints for each planet model."
Write-Host ""

