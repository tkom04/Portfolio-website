# Download all NASA Solar System GLTF Models
# This script will find and download GLTF models for all planets

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Downloading NASA Solar System Models..." -ForegroundColor Cyan
Write-Host ""

# Known NASA GLTF embed IDs (we'll try to find more)
# Format: https://solarsystem.nasa.gov/gltf_embed/{ID}/
$nasaPlanets = @{
    "sun" = @{
        "embedId" = "2352"
        "url" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
    }
}

# Function to extract GLB URL from embed page
function Get-GLBFromEmbed {
    param([string]$EmbedId, [string]$PlanetName)
    
    $embedUrl = "https://solarsystem.nasa.gov/gltf_embed/$EmbedId/"
    Write-Host "  Checking: $embedUrl" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $embedUrl -UseBasicParsing -ErrorAction Stop
        
        # Look for GLB URL pattern in the response
        if ($response.Content -match 'https://[^"\s<>]+\.glb') {
            $glbUrl = $matches[0]
            Write-Host "  Found GLB URL: $glbUrl" -ForegroundColor Green
            return $glbUrl
        }
        
        # Also check for active_storage URLs
        if ($response.Content -match 'rails/active_storage/disk/[^"\s<>]+\.glb') {
            $glbUrl = "https://solarsystem.nasa.gov/" + $matches[0]
            Write-Host "  Found GLB URL: $glbUrl" -ForegroundColor Green
            return $glbUrl
        }
        
        Write-Host "  Could not find GLB URL in page" -ForegroundColor Yellow
        return $null
    } catch {
        Write-Host "  Error accessing page: $_" -ForegroundColor Red
        return $null
    }
}

# Function to download planet model
function Download-Planet {
    param(
        [string]$PlanetName,
        [string]$EmbedId = $null,
        [string]$DirectUrl = $null
    )
    
    $outputFile = Join-Path $outputDir "${PlanetName}_nasa.glb"
    
    if (Test-Path $outputFile) {
        Write-Host "  ✓ $PlanetName already exists" -ForegroundColor Green
        return $true
    }
    
    Write-Host "Downloading $PlanetName..." -ForegroundColor Yellow
    
    # Try direct URL first
    if ($DirectUrl) {
        try {
            Invoke-WebRequest -Uri $DirectUrl -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
            Write-Host "  ✓ Downloaded $PlanetName" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "  ✗ Direct download failed: $_" -ForegroundColor Red
        }
    }
    
    # Try to extract from embed page
    if ($EmbedId) {
        $glbUrl = Get-GLBFromEmbed -EmbedId $EmbedId -PlanetName $PlanetName
        if ($glbUrl) {
            try {
                Invoke-WebRequest -Uri $glbUrl -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
                Write-Host "  ✓ Downloaded $PlanetName" -ForegroundColor Green
                return $true
            } catch {
                Write-Host "  ✗ Download failed: $_" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "  ✗ Could not download $PlanetName" -ForegroundColor Red
    return $false
}

# Download Sun (we have the URL)
Download-Planet -PlanetName "sun" -EmbedId "2352" -DirectUrl $nasaPlanets["sun"]["url"]

Write-Host ""
Write-Host "To find other planets, we need to:" -ForegroundColor Cyan
Write-Host "1. Visit each planet's 3D model page on NASA's site" -ForegroundColor Yellow
Write-Host "2. Find the GLTF embed ID from the URL" -ForegroundColor Yellow
Write-Host "3. Extract the GLB download URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Let me search for the embed IDs..." -ForegroundColor Cyan

# Try common embed ID patterns (these are guesses - we'll need to find the actual ones)
$planetEmbedIds = @{
    "mercury" = @("2353", "2354", "2355", "2356")
    "venus" = @("2357", "2358", "2359", "2360")
    "earth" = @("2361", "2362", "2363", "2364")
    "mars" = @("2365", "2366", "2367", "2368")
    "jupiter" = @("2369", "2370", "2371", "2372")
    "saturn" = @("2373", "2374", "2375", "2376")
    "uranus" = @("2377", "2378", "2379", "2380")
    "neptune" = @("2381", "2382", "2383", "2384")
}

Write-Host ""
Write-Host "Note: We'll need to manually find the embed IDs for each planet." -ForegroundColor Yellow
Write-Host "Visit https://solarsystem.nasa.gov/resources/ and search for each planet's 3D model" -ForegroundColor Yellow
Write-Host ""

