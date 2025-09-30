# Test API call without interrupting server
Write-Host "=== Testing ReviewMail Status Change API ==="

# Test moving from pending to processed
Write-Host "`n1. Testing move from pending to processed..."
Write-Host "Before API call - File content:"
Get-Content "C:\classifyMail\ReviewMail\pending\clean-no-status-test.json" | ConvertFrom-Json | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3002/api/review-mails/clean-no-status-test/status" -Method PUT -ContentType "application/json" -Body '{"status": "processed"}'
Write-Host "API Response:"
$response | ConvertTo-Json

Write-Host "`nAfter API call - File content:"
if (Test-Path "C:\classifyMail\ReviewMail\processed\clean-no-status-test.json") {
    Get-Content "C:\classifyMail\ReviewMail\processed\clean-no-status-test.json" | ConvertFrom-Json | ConvertTo-Json
} else {
    Write-Host "File not found in processed folder"
}

Write-Host "`n2. Testing move back to pending..."
$response2 = Invoke-RestMethod -Uri "http://localhost:3002/api/review-mails/clean-no-status-test/status" -Method PUT -ContentType "application/json" -Body '{"status": "pending"}'
Write-Host "API Response:"
$response2 | ConvertTo-Json

Write-Host "`nAfter second API call - File content:"
if (Test-Path "C:\classifyMail\ReviewMail\pending\clean-no-status-test.json") {
    Get-Content "C:\classifyMail\ReviewMail\pending\clean-no-status-test.json" | ConvertFrom-Json | ConvertTo-Json
} else {
    Write-Host "File not found in pending folder"
}

Write-Host "`n=== Test Complete ==="