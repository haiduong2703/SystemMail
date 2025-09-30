# Fix filePath fields in ReviewMail files
Write-Host "=== Fixing ReviewMail filePath Fields ==="

# Fix pending files
Write-Host "`nUpdating PENDING files..."
Get-ChildItem "C:\classifyMail\ReviewMail\pending\*.json" | ForEach-Object {
    $content = Get-Content $_.FullName | ConvertFrom-Json
    $oldPath = $content.filePath
    $newPath = $_.FullName
    
    Write-Host "File: $($_.Name)"
    Write-Host "  Old path: $oldPath"
    Write-Host "  New path: $newPath"
    
    # Update filePath
    $content.filePath = $newPath
    
    # Save back to file
    $content | ConvertTo-Json -Depth 10 | Set-Content $_.FullName
    Write-Host "  ✅ Updated"
}

# Fix processed files  
Write-Host "`nUpdating PROCESSED files..."
Get-ChildItem "C:\classifyMail\ReviewMail\processed\*.json" | ForEach-Object {
    $content = Get-Content $_.FullName | ConvertFrom-Json
    $oldPath = $content.filePath
    $newPath = $_.FullName
    
    Write-Host "File: $($_.Name)"
    Write-Host "  Old path: $oldPath"
    Write-Host "  New path: $newPath"
    
    # Update filePath
    $content.filePath = $newPath
    
    # Save back to file
    $content | ConvertTo-Json -Depth 10 | Set-Content $_.FullName
    Write-Host "  ✅ Updated"
}

Write-Host "`n=== Fix Complete ==="
Write-Host "Now helper function should work correctly with updated filePath fields."