# Start server and test API in same script
Write-Host "=== Starting Server and Testing API ==="

# Start server in background
Write-Host "Starting mail server..."
$serverJob = Start-Job -ScriptBlock {
    Set-Location "D:\CodeThue\SystemMail\mail-server"
    node server.js
}

# Wait for server to start
Write-Host "Waiting for server to start..."
Start-Sleep 5

# Test API call
Write-Host "`nTesting API call..."
try {
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
} catch {
    Write-Host "Error: $_"
} finally {
    # Stop server
    Write-Host "`nStopping server..."
    Stop-Job $serverJob
    Remove-Job $serverJob
}

Write-Host "`n=== Test Complete ==="