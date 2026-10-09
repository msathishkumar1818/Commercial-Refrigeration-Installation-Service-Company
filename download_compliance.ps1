# PowerShell script to download Compliance page images
$complianceDir = "c:\Users\user\Desktop\Commercial Refrigeration Installation & Service Company\assets\images\compliance"
if (!(Test-Path -Path $complianceDir)) {
    New-Item -ItemType Directory -Path $complianceDir -Force | Out-Null
}

$images = @(
    @{
        Url = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
        Dest = "$complianceDir\compliance-hero-auditing.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
        Dest = "$complianceDir\fda-haccp-inspection.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80"
        Dest = "$complianceDir\epa-refrigerant-recovery.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
        Dest = "$complianceDir\cloud-telemetry-server.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
        Dest = "$complianceDir\ultra-low-cryo-storage.jpg"
    }
)

foreach ($item in $images) {
    Write-Host "Downloading: $($item.Dest)"
    try {
        Invoke-WebRequest -Uri $item.Url -OutFile $item.Dest -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -TimeoutSec 30
        Write-Host "Success: $($item.Dest)"
    } catch {
        Write-Host "Failed downloading $($item.Url): $_"
    }
}
