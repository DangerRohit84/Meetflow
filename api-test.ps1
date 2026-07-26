$BASE = "http://localhost:3000/api"
$results = @()

function Log($test, $status, $body, $notes = "") {
    $script:results += [PSCustomObject]@{
        Test  = $test
        Status = $status
        Body  = $body
        Notes = $notes
    }
    Write-Host "[$status] $test"
    if ($body) { Write-Host "  Body: $body" }
    if ($notes) { Write-Host "  Notes: $notes" }
    Write-Host ""
}

function Login($email, $pass) {
    $body = @{ email = $email; password = $pass } | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body $body -ErrorAction Stop
        return $resp.token
    } catch {
        return $null
    }
}

function Curl-Get($url, $token) {
    $output = curl.exe -s -w "`n%{http_code}" "$url" -b "token=$token" 2>&1
    return ($output -join "`n")
}

function Curl-Post($url, $body, $token) {
    $tmpFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tmpFile, $body, [System.Text.Encoding]::UTF8)
    $output = curl.exe -s -w "`n%{http_code}" -X POST "$url" -H "Content-Type: application/json" -d "@$tmpFile" -b "token=$token" 2>&1
    Remove-Item $tmpFile -Force
    return ($output -join "`n")
}

function Curl-Put($url, $body, $token) {
    $tmpFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tmpFile, $body, [System.Text.Encoding]::UTF8)
    $output = curl.exe -s -w "`n%{http_code}" -X PUT "$url" -H "Content-Type: application/json" -d "@$tmpFile" -b "token=$token" 2>&1
    Remove-Item $tmpFile -Force
    return ($output -join "`n")
}

function Curl-PostNoBody($url, $token) {
    $output = curl.exe -s -w "`n%{http_code}" -X POST "$url" -H "Content-Type: application/json" -d "{}" -b "token=$token" 2>&1
    return ($output -join "`n")
}

function Get-StatusAndBody($raw) {
    $lines = $raw -split "`n"
    $bodyLines = @()
    $statusCode = 0
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -match "^\d{3}$" -and $statusCode -eq 0) {
            $statusCode = [int]$trimmed
        } else {
            $bodyLines += $line
        }
    }
    return @{ Status = $statusCode; Body = ($bodyLines -join "`n").Trim() }
}

$LEAD_EMAIL = "alex@meetflow.ai"
$LEAD_PASS = "password123"
$MEMBER_EMAIL = "sarah@meetflow.ai"
$MEMBER_PASS = "password123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  API ENDPOINT TEST REPORT" -ForegroundColor Cyan
Write-Host "  Base URL: $BASE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Login as lead
Write-Host ">>> 1. POST /api/auth/login (valid lead)" -ForegroundColor Yellow
$leadToken = Login $LEAD_EMAIL $LEAD_PASS
if ($leadToken) {
    Log "POST /api/auth/login (valid lead)" "200" "Token obtained" "Token: $($leadToken.Substring(0, [Math]::Min(40, $leadToken.Length)))..."
} else {
    Log "POST /api/auth/login (valid lead)" "FAIL" "" "No token returned"
}

# 1b. Invalid login
Write-Host ">>> 1b. POST /api/auth/login (invalid)" -ForegroundColor Yellow
$badBody = @{ email = "wrong@email.com"; password = "wrongpass" } | ConvertTo-Json
$badRaw = Curl-Post "$BASE/auth/login" $badBody ""
$bad = Get-StatusAndBody $badRaw
if ($bad.Status -eq 401) {
    Log "POST /api/auth/login (invalid creds)" "401" $bad.Body "Correctly rejected"
} else {
    Log "POST /api/auth/login (invalid creds)" "CHECK" $bad.Body "Expected 401"
}

# 1c. Missing fields
Write-Host ">>> 1c. POST /api/auth/login (missing fields)" -ForegroundColor Yellow
$emptyBody = @{ email = ""; password = "" } | ConvertTo-Json
$emptyRaw = Curl-Post "$BASE/auth/login" $emptyBody ""
$empty = Get-StatusAndBody $emptyRaw
if ($empty.Status -eq 400) {
    Log "POST /api/auth/login (missing fields)" "400" $empty.Body "Correctly returned 400"
} else {
    Log "POST /api/auth/login (missing fields)" "CHECK" $empty.Body "Expected 400"
}

# 2. GET /api/auth/me with token
Write-Host ">>> 2. GET /api/auth/me (with token)" -ForegroundColor Yellow
$meRaw = Curl-Get "$BASE/auth/me" $leadToken
$me = Get-StatusAndBody $meRaw
if ($me.Status -eq 200 -and $me.Body -match "alex") {
    Log "GET /api/auth/me (with token)" "200" $me.Body.Substring(0, [Math]::Min(200, $me.Body.Length)) "User found"
} else {
    Log "GET /api/auth/me (with token)" "CHECK" $me.Body.Substring(0, [Math]::Min(200, $me.Body.Length)) ""
}

# 2b. GET /api/auth/me without token
Write-Host ">>> 2b. GET /api/auth/me (no token)" -ForegroundColor Yellow
$meNoRaw = curl.exe -s -w "`n%{http_code}" "$BASE/auth/me" 2>&1
$meNo = Get-StatusAndBody ($meNoRaw -join "`n")
if ($meNo.Status -eq 401) {
    Log "GET /api/auth/me (no token)" "401" $meNo.Body "Correctly rejected"
} else {
    Log "GET /api/auth/me (no token)" "CHECK" $meNo.Body "Expected 401"
}

# 3. GET /api/meetings
Write-Host ">>> 3. GET /api/meetings (as lead)" -ForegroundColor Yellow
$mtgRaw = Curl-Get "$BASE/meetings" $leadToken
$mtg = Get-StatusAndBody $mtgRaw
if ($mtg.Status -eq 200) {
    Log "GET /api/meetings (lead)" "200" $mtg.Body.Substring(0, [Math]::Min(300, $mtg.Body.Length)) "Meetings list returned"
} else {
    Log "GET /api/meetings (lead)" "CHECK" $mtg.Body.Substring(0, [Math]::Min(300, $mtg.Body.Length)) ""
}

# 4. POST /api/meetings
Write-Host ">>> 4. POST /api/meetings (create)" -ForegroundColor Yellow
$now = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.000Z"
$createMtg = @{ title = "API Test Meeting $(Get-Date -Format 'HHmmss')"; date = $now; summary = "Test meeting created by API test script" } | ConvertTo-Json
$createBody = curl.exe -s "$BASE/meetings" -X POST -H "Content-Type: application/json" -d "@$([System.IO.Path]::GetTempPath())createMtg.json" -b "token=$leadToken" 2>&1
$tmpFile = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tmpFile, $createMtg, [System.Text.Encoding]::UTF8)
$createBody = curl.exe -s "$BASE/meetings" -X POST -H "Content-Type: application/json" -d "@$tmpFile" -b "token=$leadToken" 2>&1
Remove-Item $tmpFile -Force
$createdMtgId = ""
try {
    $parsed = ($createBody -join "`n" | ConvertFrom-Json -ErrorAction Stop)
    $createdMtgId = $parsed.id
    Log "POST /api/meetings (create)" "200" "Meeting created" "Meeting ID: $createdMtgId"
} catch {
    Log "POST /api/meetings (create)" "CHECK" ($createBody -join "`n").Substring(0, [Math]::Min(300, ($createBody -join "`n").Length)) ""
}

# 4b. Missing fields
Write-Host ">>> 4b. POST /api/meetings (missing title)" -ForegroundColor Yellow
$badMtg = @{ date = $now } | ConvertTo-Json
$badMtgRaw = Curl-Post "$BASE/meetings" $badMtg $leadToken
$badMtg = Get-StatusAndBody $badMtgRaw
if ($badMtg.Status -eq 400) {
    Log "POST /api/meetings (missing fields)" "400" $badMtg.Body "Correctly returned 400"
} else {
    Log "POST /api/meetings (missing fields)" "CHECK" $badMtg.Body "Expected 400"
}

# 5. GET /api/tasks
Write-Host ">>> 5. GET /api/tasks (as lead)" -ForegroundColor Yellow
$taskRaw = Curl-Get "$BASE/tasks" $leadToken
$task = Get-StatusAndBody $taskRaw
if ($task.Status -eq 200) {
    Log "GET /api/tasks (lead)" "200" $task.Body.Substring(0, [Math]::Min(300, $task.Body.Length)) "Tasks list returned"
} else {
    Log "GET /api/tasks (lead)" "CHECK" $task.Body.Substring(0, [Math]::Min(300, $task.Body.Length)) ""
}

# 6. POST /api/tasks
Write-Host ">>> 6. POST /api/tasks (create)" -ForegroundColor Yellow
$memBody = curl.exe -s "$BASE/members" -b "token=$leadToken" 2>&1
$sarahId = ""
try {
    $members = ($memBody -join "`n" | ConvertFrom-Json -ErrorAction Stop).members
    $sarah = $members | Where-Object { $_.email -eq $MEMBER_EMAIL }
    if ($sarah) { $sarahId = $sarah.id }
} catch {}
$createTask = @{ title = "API Test Task $(Get-Date -Format 'HHmmss')"; description = "Test task"; assigneeId = $sarahId; meetingId = $createdMtgId; priority = "high" } | ConvertTo-Json
$taskCreateRaw = Curl-Post "$BASE/tasks" $createTask $leadToken
$taskCreate = Get-StatusAndBody $taskCreateRaw
if ($taskCreate.Status -eq 200 -or $taskCreate.Status -eq 201) {
    Log "POST /api/tasks (create)" "200" "Task created" ""
} else {
    Log "POST /api/tasks (create)" "CHECK" $taskCreate.Body.Substring(0, [Math]::Min(400, $taskCreate.Body.Length)) ""
}

# 7. GET /api/members
Write-Host ">>> 7. GET /api/members (as lead)" -ForegroundColor Yellow
$memResp = Curl-Get "$BASE/members" $leadToken
$mem = Get-StatusAndBody $memResp
if ($mem.Status -eq 200) {
    Log "GET /api/members (lead)" "200" $mem.Body.Substring(0, [Math]::Min(300, $mem.Body.Length)) "Members list returned"
} else {
    Log "GET /api/members (lead)" "CHECK" $mem.Body.Substring(0, [Math]::Min(300, $mem.Body.Length)) ""
}

# 8. GET /api/settings
Write-Host ">>> 8. GET /api/settings (as lead)" -ForegroundColor Yellow
$setRaw = Curl-Get "$BASE/settings" $leadToken
$set = Get-StatusAndBody $setRaw
if ($set.Status -eq 200) {
    Log "GET /api/settings (lead)" "200" $set.Body.Substring(0, [Math]::Min(400, $set.Body.Length)) "Settings returned"
} else {
    Log "GET /api/settings (lead)" "CHECK" $set.Body.Substring(0, [Math]::Min(300, $set.Body.Length)) ""
}

# 9. PUT /api/settings
Write-Host ">>> 9. PUT /api/settings (update)" -ForegroundColor Yellow
$updSettings = @{ aiProvider = "groq"; aiModel = "llama3-8b-8192" } | ConvertTo-Json
$updRaw = Curl-Put "$BASE/settings" $updSettings $leadToken
$upd = Get-StatusAndBody $updRaw
if ($upd.Status -eq 200) {
    Log "PUT /api/settings (update)" "200" "Settings updated" ""
} else {
    Log "PUT /api/settings (update)" "CHECK" $upd.Body.Substring(0, [Math]::Min(300, $upd.Body.Length)) ""
}

# 10. POST /api/invite
Write-Host ">>> 10. POST /api/invite (generate)" -ForegroundColor Yellow
$invRaw = Curl-PostNoBody "$BASE/invite" $leadToken
$inv = Get-StatusAndBody $invRaw
if ($inv.Status -eq 200) {
    Log "POST /api/invite (generate)" "200" "Invite generated" ""
} else {
    Log "POST /api/invite (generate)" "CHECK" $inv.Body.Substring(0, [Math]::Min(300, $inv.Body.Length)) ""
}

# 11a. POST /api/ai/extract without API key
Write-Host ">>> 11a. POST /api/ai/extract (without API key)" -ForegroundColor Yellow
$transcript = @{ transcript = "John: Let's discuss the project deadline. Sarah: I think we need two more weeks." } | ConvertTo-Json
$aiRaw = Curl-Post "$BASE/ai/extract" $transcript $leadToken
$ai = Get-StatusAndBody $aiRaw
if ($ai.Status -eq 500 -or $ai.Status -eq 400 -or $ai.Body -match "error") {
    Log "POST /api/ai/extract (no API key)" "$($ai.Status)/Expected" $ai.Body.Substring(0, [Math]::Min(300, $ai.Body.Length)) "Expected failure - no API key"
} elseif ($ai.Status -eq 200) {
    Log "POST /api/ai/extract (no API key)" "200" $ai.Body.Substring(0, [Math]::Min(400, $ai.Body.Length)) "Extraction succeeded"
} else {
    Log "POST /api/ai/extract (no API key)" "CHECK" $ai.Body.Substring(0, [Math]::Min(300, $ai.Body.Length)) ""
}

# 11b. Empty transcript
Write-Host ">>> 11b. POST /api/ai/extract (empty transcript)" -ForegroundColor Yellow
$emptyTrans = @{ transcript = "" } | ConvertTo-Json
$aiEmptyRaw = Curl-Post "$BASE/ai/extract" $emptyTrans $leadToken
$aiEmpty = Get-StatusAndBody $aiEmptyRaw
if ($aiEmpty.Status -eq 400) {
    Log "POST /api/ai/extract (empty)" "400" $aiEmpty.Body "Correctly returned 400"
} else {
    Log "POST /api/ai/extract (empty)" "CHECK" $aiEmpty.Body "Expected 400"
}

# 11c. No auth
Write-Host ">>> 11c. POST /api/ai/extract (no auth)" -ForegroundColor Yellow
$aiNoAuthRaw = Curl-Post "$BASE/ai/extract" $transcript ""
$aiNoAuth = Get-StatusAndBody $aiNoAuthRaw
if ($aiNoAuth.Status -eq 401 -or $aiNoAuth.Status -eq 403) {
    Log "POST /api/ai/extract (no auth)" "$($aiNoAuth.Status)" $aiNoAuth.Body "Correctly rejected"
} else {
    Log "POST /api/ai/extract (no auth)" "CHECK" $aiNoAuth.Body "Expected 401/403"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MEMBER ROLE TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Login as member
$memberToken = Login $MEMBER_EMAIL $MEMBER_PASS
if ($memberToken) {
    Log "Login as member ($MEMBER_EMAIL)" "200" "Token obtained" ""
} else {
    Log "Login as member ($MEMBER_EMAIL)" "FAIL" "" "No token"
}

# M1. GET /api/meetings as member
Write-Host ">>> M1. GET /api/meetings (as member)" -ForegroundColor Yellow
$memMtgRaw = Curl-Get "$BASE/meetings" $memberToken
$memMtg = Get-StatusAndBody $memMtgRaw
if ($memMtg.Status -eq 200) {
    Log "GET /api/meetings (member)" "200" $memMtg.Body.Substring(0, [Math]::Min(300, $memMtg.Body.Length)) "Member sees team meetings"
} else {
    Log "GET /api/meetings (member)" "CHECK" $memMtg.Body.Substring(0, [Math]::Min(300, $memMtg.Body.Length)) ""
}

# M2. GET /api/tasks as member
Write-Host ">>> M2. GET /api/tasks (as member)" -ForegroundColor Yellow
$memTaskRaw = Curl-Get "$BASE/tasks" $memberToken
$memTask = Get-StatusAndBody $memTaskRaw
if ($memTask.Status -eq 200) {
    Log "GET /api/tasks (member)" "200" $memTask.Body.Substring(0, [Math]::Min(300, $memTask.Body.Length)) "Member sees assigned tasks"
} else {
    Log "GET /api/tasks (member)" "CHECK" $memTask.Body.Substring(0, [Math]::Min(300, $memTask.Body.Length)) ""
}

# M3. POST /api/meetings as member (should fail)
Write-Host ">>> M3. POST /api/meetings (as member - should fail)" -ForegroundColor Yellow
$memCreateMtg = @{ title = "Unauthorized Meeting"; date = $now } | ConvertTo-Json
$memCreateRaw = Curl-Post "$BASE/meetings" $memCreateMtg $memberToken
$memCreate = Get-StatusAndBody $memCreateRaw
if ($memCreate.Status -eq 403) {
    Log "POST /api/meetings (member)" "403" $memCreate.Body "Correctly denied"
} else {
    Log "POST /api/meetings (member)" "CHECK" $memCreate.Body "Expected 403"
}

# M4. GET /api/members as member (should fail)
Write-Host ">>> M4. GET /api/members (as member - should fail)" -ForegroundColor Yellow
$memMembersRaw = Curl-Get "$BASE/members" $memberToken
$memMembers = Get-StatusAndBody $memMembersRaw
if ($memMembers.Status -eq 403) {
    Log "GET /api/members (member)" "403" $memMembers.Body "Correctly denied"
} else {
    Log "GET /api/members (member)" "CHECK" $memMembers.Body "Expected 403"
}

# M5. POST /api/tasks as member (should fail)
Write-Host ">>> M5. POST /api/tasks (as member - should fail)" -ForegroundColor Yellow
$memCreateTask = @{ title = "Unauthorized Task"; assigneeId = "test"; meetingId = "test" } | ConvertTo-Json
$memTaskCreateRaw = Curl-Post "$BASE/tasks" $memCreateTask $memberToken
$memTaskCreate = Get-StatusAndBody $memTaskCreateRaw
if ($memTaskCreate.Status -eq 403) {
    Log "POST /api/tasks (member)" "403" $memTaskCreate.Body "Correctly denied"
} else {
    Log "POST /api/tasks (member)" "CHECK" $memTaskCreate.Body "Expected 403"
}

# M6. POST /api/invite as member (should fail)
Write-Host ">>> M6. POST /api/invite (as member - should fail)" -ForegroundColor Yellow
$memInviteRaw = Curl-PostNoBody "$BASE/invite" $memberToken
$memInvite = Get-StatusAndBody $memInviteRaw
if ($memInvite.Status -eq 403) {
    Log "POST /api/invite (member)" "403" $memInvite.Body "Correctly denied"
} else {
    Log "POST /api/invite (member)" "CHECK" $memInvite.Body "Expected 403"
}

# M7. POST /api/ai/extract as member (should fail)
Write-Host ">>> M7. POST /api/ai/extract (as member - should fail)" -ForegroundColor Yellow
$memAiRaw = Curl-Post "$BASE/ai/extract" $transcript $memberToken
$memAi = Get-StatusAndBody $memAiRaw
if ($memAi.Status -eq 403) {
    Log "POST /api/ai/extract (member)" "403" $memAi.Body "Correctly denied"
} else {
    Log "POST /api/ai/extract (member)" "CHECK" $memAi.Body "Expected 403"
}

# M8. PUT /api/settings as member
Write-Host ">>> M8. PUT /api/settings (as member)" -ForegroundColor Yellow
$memSetRaw = Curl-Put "$BASE/settings" $updSettings $memberToken
$memSet = Get-StatusAndBody $memSetRaw
if ($memSet.Status -eq 200) {
    Log "PUT /api/settings (member)" "200" "Members can update own settings"
} else {
    Log "PUT /api/settings (member)" "CHECK" $memSet.Body ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
$results | Format-Table -AutoSize -Property Test, Status, Notes
