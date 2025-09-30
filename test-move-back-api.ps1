# Test move back API with detailed logging
Write-Host "=== Testing Move Back API ==="

$testMail = @{
  mailId = "1758251188844"
  mailData = @{
    id = "1758251188844"
    Subject = "testmail19911"
    originalCategory = "DungHan"  
    originalStatus = "mustRep"
    filePath = "C:\classifyMail\ReviewMail\processed\1758251188844.json"
    fileName = "1758251188844.json"
  }
}

$body = $testMail | ConvertTo-Json -Depth 3
Write-Host "Request body:"
Write-Host $body

Write-Host "`nExpected behavior:"
Write-Host "- Current status: processed (from filePath)"
Write-Host "- Original category: DungHan" 
Write-Host "- Should move to: DungHan/rep"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/move-back-from-review" -Method POST -ContentType "application/json" -Body $body
    Write-Host "`nAPI Response:"
    $response | ConvertTo-Json -Depth 3
    
    Write-Host "`nChecking file locations..."
    if (Test-Path "C:\classifyMail\DungHan\rep\1758251188844.json") {
        Write-Host "✅ File found in DungHan/rep"
        $content = Get-Content "C:\classifyMail\DungHan\rep\1758251188844.json" | ConvertFrom-Json
        Write-Host "  Status: $($content.status)"
        Write-Host "  isReplied: $($content.isReplied)"
        Write-Host "  category: $($content.category)"
    } else {
        Write-Host "❌ File NOT found in DungHan/rep"
    }
    
    if (Test-Path "C:\classifyMail\ReviewMail\processed\1758251188844.json") {
        Write-Host "❌ File still exists in ReviewMail/processed (should be removed)"
    } else {
        Write-Host "✅ File removed from ReviewMail/processed"
    }
} catch {
    Write-Host "❌ API Error: $_"
}

Write-Host "`n=== Test Complete ==="