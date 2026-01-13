# Download NASA Solar System GLTF Models
# Based on NASA's GLTF embed system

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Downloading NASA Solar System GLTF Models..." -ForegroundColor Cyan
Write-Host ""

# NASA GLTF embed IDs (found from solarsystem.nasa.gov/gltf_embed/{ID}/)
# These IDs correspond to the embed pages for each planet
$nasaPlanets = @{
    "sun" = @{
        "embedId" = "2352"
        "url" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
    }
}

# Function to download GLTF from embed page
function Download-PlanetGLTF {
    param(
        [string]$PlanetName,
        [string]$EmbedId,
        [string]$DirectUrl = $null
    )
    
    $outputFile = Join-Path $outputDir "${PlanetName}_nasa.glb"
    
    if (Test-Path $outputFile) {
        Write-Host "  ✓ $PlanetName already exists" -ForegroundColor Green
        return
    }
    
    Write-Host "Downloading $PlanetName..." -ForegroundColor Yellow
    
    if ($DirectUrl) {
        try {
            Invoke-WebRequest -Uri $DirectUrl -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
            Write-Host "  ✓ Downloaded $PlanetName" -ForegroundColor Green
            return
        } catch {
            Write-Host "  ✗ Failed to download $PlanetName`: $_" -ForegroundColor Red
        }
    }
    
    # Try to fetch from embed page
    $embedUrl = "https://solarsystem.nasa.gov/gltf_embed/$EmbedId/"
    Write-Host "  → Checking embed page: $embedUrl" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $embedUrl -UseBasicParsing -ErrorAction Stop
        
        # Look for GLB URL in response
        if ($response.Content -match 'https://[^"\s]+\.glb') {
            $glbUrl = $matches[0]
            Write-Host "  → Found GLB URL: $glbUrl" -ForegroundColor Gray
            Invoke-WebRequest -Uri $glbUrl -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
            Write-Host "  ✓ Downloaded $PlanetName" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Could not find GLB URL in embed page" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ Failed to access embed page: $_" -ForegroundColor Red
    }
}

# Download Sun (we already have the direct URL)
Download-PlanetGLTF -PlanetName "sun" -EmbedId "2352" -DirectUrl $nasaPlanets["sun"]["url"]

Write-Host ""
Write-Host "To download other planets, you'll need to:" -ForegroundColor Cyan
Write-Host "1. Visit https://solarsystem.nasa.gov/resources/" -ForegroundColor Yellow
Write-Host "2. Search for each planet's 3D model" -ForegroundColor Yellow
Write-Host "3. Find the GLTF embed page URL (format: /gltf_embed/{ID}/)" -ForegroundColor Yellow
Write-Host "4. Extract the GLB download URL from the network requests" -ForegroundColor Yellow
Write-Host ""
Write-Host "Alternatively, check NASA's GitHub repository for 3D models:" -ForegroundColor Cyan
Write-Host "https://github.com/nasa/NASA-3D-Resources" -ForegroundColor Yellow
Write-Host ""

