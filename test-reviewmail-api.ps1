# Test ReviewMail API data
Write-Host "=== Testing ReviewMail API Data ==="

try {
    $mails = Invoke-RestMethod -Uri "http://localhost:3002/api/mails" -Method GET
    $reviewMails = $mails | Where-Object { $_.category -eq "ReviewMail" }
    
    Write-Host "Total mails from API: $($mails.Count)"
    Write-Host "ReviewMail count: $($reviewMails.Count)"
    
    if ($reviewMails.Count -gt 0) {
        Write-Host "`nReviewMail details:"
        $reviewMails | ForEach-Object {
            Write-Host "ID: $($_.id)"
            Write-Host "  FilePath: $($_.filePath)"
            Write-Host "  isReplied: $($_.isReplied)"
            Write-Host "  status: $($_.status)"
            Write-Host "  category: $($_.category)"
            
            # Test helper function logic
            $isPendingFolder = $_.filePath -like "*pending*"
            $isProcessedFolder = $_.filePath -like "*processed*"
            
            Write-Host "  Folder analysis: pending=$isPendingFolder, processed=$isProcessedFolder"
            Write-Host "  Expected reply status: $isProcessedFolder"
            Write-Host "---"
        }
    } else {
        Write-Host "No ReviewMail data found!"
    }
} catch {
    Write-Host "Error calling API: $_"
}

Write-Host "`n=== Test Complete ==="