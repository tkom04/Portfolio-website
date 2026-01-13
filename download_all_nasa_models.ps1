# Download all NASA Solar System GLTF Models

$outputDir = "public\textures\solar-system"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Downloading all NASA Solar System Models..." -ForegroundColor Cyan
Write-Host ""

# NASA GLTF model URLs
$nasaModels = @{
    "sun" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNVEk1Tm1GbVkyRXRObUl5WVMwMFpEa3lMV0kwTW1VdE0yVmpPV1ZpWlRobE9UUTNCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlsTjFibDh4WHpFek9URXdNREF1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZFRkVzVmTVY4eE16a3hNREF3TG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--f54421206ad15f1453f1d0f30fd177d56e4668d6/Sun_1_1391000.glb"
    "saturn" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBNelV4WldVeVpUY3RNell5WmkwME1UVmpMV0UyTURJdE5tTmlNR1kyTWpjeFlXSmhCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUluQnZjM1JsY2w5ellYUjFjbTR1YW5Cbklqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZEZZWEowYUY4eFh6RXlOelUyTG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--acf7896c969ce2c178b110ae922076eea82c25e3/Saturn_1_120536.glb"
    "earth" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBaakUwWlRNd1lqSXRPR0l6TnkwME1qQmhMVGcyWWpBdE0yUXlOMk14Wm1ObVpUTTBCam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pSWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUlrVmhjblJvWHpGZk1USTNOVFl1WjJ4aUlqc2dabWxzWlc1aGJXVXFQVlZVUmkwNEp5ZEZZWEowYUY4eFh6RXlOelUyTG1kc1lnWTdCbFE2RVdOdmJuUmxiblJmZEhsd1pVa2lIV0Z3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJRWTdCbFE2RVhObGNuWnBZMlZmYm1GdFpUb0tiRzlqWVd3PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--e415e23b3e8f898327171109758a66a254794524/Earth_1_12756.glb"
    "mars" = "https://solarsystem.nasa.gov/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9JYTJWNVNTSXBaVE01TkRrNE5HWXRZbU5oTUMwMFpUaGpMVGxqWm1ZdE5qWmlPREpoTnpFNE5tWm1Cam9HUlZRNkVHUnBjM0J2YzJsMGFXOXVTU0pOWVhSMFlXTm9iV1Z1ZERzZ1ptbHNaVzVoYldVOUluQnZjM1JsY2w5dFlYSnpMbXB3WnlJN0lHWnBiR1Z1WVcxbEtqMVZWRVl0T0NjbmNHOXpkR1Z5WDIxaGNuTXVhbkJuQmpzR1ZEb1JZMjl1ZEdWdWRGOTBlWEJsU1NJQUJqc0dWRG9SYzJWeWRtbGpaVjl1WVcxbE9ncHNiMk5oYkE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9rZXkifX0=--5e4cd16a65321ef886bbe67e1cd6018b612257fd/Mars_1_6792.glb"
}

# Function to extract GLB URL from science.nasa.gov page
function Get-GLBFromSciencePage {
    param([string]$PageUrl, [string]$PlanetName)
    
    try {
        $response = Invoke-WebRequest -Uri $PageUrl -UseBasicParsing -ErrorAction Stop
        
        # Look for glTF download link
        if ($response.Content -match 'href="([^"]+\.glb[^"]*)"') {
            $glbUrl = $matches[1]
            # Make absolute URL if relative
            if ($glbUrl -notmatch '^https?://') {
                $glbUrl = "https://science.nasa.gov" + $glbUrl
            }
            Write-Host "  Found GLB URL for $PlanetName" -ForegroundColor Green
            return $glbUrl
        }
        
        # Also check for direct download links
        if ($response.Content -match 'glTF File.*href="([^"]+)"') {
            $glbUrl = $matches[1]
            if ($glbUrl -notmatch '^https?://') {
                $glbUrl = "https://science.nasa.gov" + $glbUrl
            }
            Write-Host "  Found GLB URL for $PlanetName" -ForegroundColor Green
            return $glbUrl
        }
    } catch {
        Write-Host "  Error accessing $PlanetName page: $_" -ForegroundColor Red
    }
    
    return $null
}

# Get URLs for planets on science.nasa.gov
Write-Host "Extracting URLs from science.nasa.gov pages..." -ForegroundColor Yellow

$mercuryUrl = Get-GLBFromSciencePage -PageUrl "https://science.nasa.gov/resource/mercury-3d-model/" -PlanetName "Mercury"
if ($mercuryUrl) { $nasaModels["mercury"] = $mercuryUrl }

$venusUrl = Get-GLBFromSciencePage -PageUrl "https://science.nasa.gov/resource/venus-3d-model/" -PlanetName "Venus"
if ($venusUrl) { $nasaModels["venus"] = $venusUrl }

$jupiterUrl = Get-GLBFromSciencePage -PageUrl "https://science.nasa.gov/resource/jupiter-3d-model/" -PlanetName "Jupiter"
if ($jupiterUrl) { $nasaModels["jupiter"] = $jupiterUrl }

$uranusUrl = Get-GLBFromSciencePage -PageUrl "https://science.nasa.gov/resource/Uranus-3d-model/" -PlanetName "Uranus"
if ($uranusUrl) { $nasaModels["uranus"] = $uranusUrl }

$neptuneUrl = Get-GLBFromSciencePage -PageUrl "https://science.nasa.gov/resource/neptune-3d-model/" -PlanetName "Neptune"
if ($neptuneUrl) { $nasaModels["neptune"] = $neptuneUrl }

Write-Host ""
Write-Host "Downloading models..." -ForegroundColor Cyan
Write-Host ""

# Download all models
$downloaded = 0
$failed = 0

foreach ($planetName in $nasaModels.Keys) {
    $url = $nasaModels[$planetName]
    $outputFile = Join-Path $outputDir "${planetName}_nasa.glb"
    
    if (Test-Path $outputFile) {
        Write-Host "  ✓ $planetName already exists" -ForegroundColor Green
        $downloaded++
        continue
    }
    
    if (-not $url) {
        Write-Host "  ✗ $planetName - No URL found" -ForegroundColor Red
        $failed++
        continue
    }
    
    Write-Host "Downloading $planetName..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputFile -UseBasicParsing -ErrorAction Stop
        $size = (Get-Item $outputFile).Length / 1MB
        Write-Host "  ✓ Downloaded $planetName ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
        $downloaded++
    } catch {
        Write-Host "  ✗ Failed: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Summary: Downloaded $downloaded, Failed $failed" -ForegroundColor Cyan

