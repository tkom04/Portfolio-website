# Download all NASA Solar System GLTF Models
# Using known embed IDs and direct URLs

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Downloading NASA Solar System Models..." -ForegroundColor Cyan
Write-Host ""

# NASA GLTF models - we'll try to find them systematically
$planets = @{
    "sun" = @{
        "embedId" = "2352"
        "url" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
    }
}

# Function to extract GLB URL from embed page
function Get-GLBUrl {
    param([int]$EmbedId)
    
    $embedUrl = "https://solarsystem.nasa.gov/gltf_embed/$EmbedId/"
    
    try {
        $response = Invoke-WebRequest -Uri $embedUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            # Look for GLB URL
            if ($response.Content -match 'rails/active_storage/disk/[^"\s<>]+\.glb') {
                $glbPath = $matches[0]
                return "https://solarsystem.nasa.gov/$glbPath"
            }
        }
    } catch {
        return $null
    }
    
    return $null
}

# Try to find other planets by testing embed IDs
Write-Host "Searching for planet embed IDs..." -ForegroundColor Yellow
$testIds = 2350..2400  # Test a range of IDs

foreach ($id in $testIds) {
    if ($id -eq 2352) { continue }  # Skip Sun
    
    $glbUrl = Get-GLBUrl -EmbedId $id
    if ($glbUrl) {
        # Try to identify planet from filename
        $planetName = "unknown"
        if ($glbUrl -match '/(\w+)[_\s]?\d+\.glb') {
            $planetName = $matches[1].ToLower()
        }
        
        Write-Host "  Found: ID $id -> $planetName" -ForegroundColor Green
        $planets[$planetName] = @{
            "embedId" = $id
            "url" = $glbUrl
        }
        
        # Stop if we found all 9 planets
        if ($planets.Count -ge 9) { break }
    }
}

Write-Host ""
Write-Host "Downloading models..." -ForegroundColor Cyan
Write-Host ""

# Download all found planets
$downloaded = 0
foreach ($planetName in $planets.Keys) {
    $planet = $planets[$planetName]
    $outputFile = Join-Path $outputDir "${planetName}_nasa.glb"
    
    if (Test-Path $outputFile) {
        Write-Host "  ✓ $planetName already exists" -ForegroundColor Green
        $downloaded++
        continue
    }
    
    Write-Host "Downloading $planetName..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $planet.url -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✓ Downloaded $planetName" -ForegroundColor Green
        $downloaded++
    } catch {
        Write-Host "  ✗ Failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Downloaded $downloaded out of $($planets.Count) models" -ForegroundColor Cyan

