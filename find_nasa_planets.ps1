# Find and download all NASA planet GLTF models
# We'll try sequential IDs around the Sun's ID (2352)

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Searching for NASA planet GLTF models..." -ForegroundColor Cyan
Write-Host ""

# Known Sun ID
$sunId = 2352
$foundPlanets = @{
    "sun" = @{
        "id" = $sunId
        "url" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
    }
}

# Function to check if an embed ID contains a planet
function Test-PlanetEmbed {
    param([int]$EmbedId)
    
    $embedUrl = "https://solarsystem.nasa.gov/gltf_embed/$EmbedId/"
    
    try {
        $response = Invoke-WebRequest -Uri $embedUrl -UseBasicParsing -ErrorAction Stop -TimeoutSec 5
        
        # Check if it's a valid planet page (not 404)
        if ($response.StatusCode -eq 200) {
            # Look for GLB URL
            if ($response.Content -match 'rails/active_storage/disk/[^"\s<>]+\.glb') {
                $glbPath = $matches[0]
                $glbUrl = "https://solarsystem.nasa.gov/$glbPath"
                
                # Try to identify planet from URL or content
                $planetName = $null
                if ($response.Content -match '(\w+)\s+3D\s+Model') {
                    $planetName = $matches[1].ToLower()
                } elseif ($glbUrl -match '/(\w+)[_\s]?\d+\.glb') {
                    $planetName = $matches[1].ToLower()
                }
                
                return @{
                    "found" = $true
                    "url" = $glbUrl
                    "name" = $planetName
                }
            }
        }
    } catch {
        # 404 or other error - not a valid embed
        return @{ "found" = $false }
    }
    
    return @{ "found" = $false }
}

# Try IDs around the Sun (2352)
Write-Host "Scanning embed IDs around Sun (ID: $sunId)..." -ForegroundColor Yellow
$testRange = 2340..2370  # Try IDs from 2340 to 2370

foreach ($id in $testRange) {
    if ($id -eq $sunId) { continue }  # Skip Sun, we already have it
    
    $result = Test-PlanetEmbed -EmbedId $id
    if ($result.found) {
        $planetName = if ($result.name) { $result.name } else { "planet_$id" }
        Write-Host "  Found: ID $id -> $planetName" -ForegroundColor Green
        $foundPlanets[$planetName] = @{
            "id" = $id
            "url" = $result.url
        }
    }
}

Write-Host ""
Write-Host "Found $($foundPlanets.Count) planet(s)" -ForegroundColor Cyan
Write-Host ""

# Download all found planets
foreach ($planetName in $foundPlanets.Keys) {
    $planet = $foundPlanets[$planetName]
    $outputFile = Join-Path $outputDir "${planetName}_nasa.glb"
    
    if (Test-Path $outputFile) {
        Write-Host "  ✓ $planetName already downloaded" -ForegroundColor Green
        continue
    }
    
    Write-Host "Downloading $planetName..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $planet.url -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✓ Downloaded $planetName" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan

