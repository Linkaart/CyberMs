$ports = @(5173,4000)
foreach ($p in $ports) {
  $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if ($conns) {
    $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pidVal in $pids) {
      try { Stop-Process -Id $pidVal -Force; Write-Output ("Stopped PID {0} for port {1}" -f $pidVal, $p) } catch { Write-Output ("Failed to stop PID {0} for port {1}: {2}" -f $pidVal, $p, $_.Exception.Message) }
    }
  } else {
    Write-Output "No listener on port $p"
  }
}

# stop start-demo node processes if any
$nodes = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'start-demo.js' }
if ($nodes) {
  foreach ($n in $nodes) {
    try { Stop-Process -Id $n.ProcessId -Force; Write-Output ("Stopped start-demo node PID {0}" -f $n.ProcessId) } catch { Write-Output ("Failed to stop start-demo node PID {0}: {1}" -f $n.ProcessId, $_.Exception.Message) }
  }
} else {
  Write-Output "No start-demo node processes found"
}

# confirm ports
foreach ($p in $ports) {
  $out = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if ($out) { Write-Output ("PORT {0} STILL IN USE" -f $p) } else { Write-Output ("PORT {0} FREE" -f $p) }
}
