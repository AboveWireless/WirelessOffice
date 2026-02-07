import { useEffect, useMemo, useState } from 'react'
import {
  addLog,
  clearLogs,
  fetchDevices,
  fetchLogs,
  fetchPermissions,
  refreshPermissions
} from '../data/mockApi'
import type { BleDevice, DiagnosticsEntry, PermissionState } from '../model/types'

type Route = 'onboarding' | 'devices' | 'detail' | 'diagnostics'

export default function App() {
  const [route, setRoute] = useState<Route>('onboarding')
  const [selectedDevice, setSelectedDevice] = useState<BleDevice | null>(null)

  const [permissions, setPermissions] = useState<PermissionState>({ bluetooth: false, location: false, camera: false })
  const [devices, setDevices] = useState<BleDevice[]>([])
  const [logs, setLogs] = useState<DiagnosticsEntry[]>([])
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    void fetchPermissions().then(setPermissions)
    void fetchLogs().then(setLogs)
  }, [])

  const permissionChecklist = useMemo(
    () => [
      { label: 'Bluetooth enabled', ready: permissions.bluetooth },
      { label: 'Location permission', ready: permissions.location },
      { label: 'Camera permission', ready: permissions.camera }
    ],
    [permissions]
  )

  async function handleRefreshPermissions() {
    const updated = await refreshPermissions()
    setPermissions(updated)
    setLogs(await addLog('Permissions refreshed'))
  }

  async function handleStartScan() {
    setScanning(true)
    setDevices(await fetchDevices())
    setLogs(await addLog('BLE scan started'))
  }

  async function handleStopScan() {
    setScanning(false)
    setLogs(await addLog('BLE scan stopped'))
  }

  const page = (() => {
    if (route === 'onboarding') {
      return (
        <section className="panel">
          <h1>Wireless Office Setup</h1>
          <p>Prepare permissions and continue to BLE device discovery.</p>
          <ul>
            {permissionChecklist.map((item) => (
              <li key={item.label}>{item.label}: {item.ready ? 'Ready' : 'Needs access'}</li>
            ))}
          </ul>
          <div className="row">
            <button onClick={handleRefreshPermissions}>Refresh permissions</button>
            <button onClick={() => setRoute('devices')}>Continue</button>
          </div>
        </section>
      )
    }

    if (route === 'devices') {
      return (
        <section className="panel">
          <h1>Nearby devices</h1>
          <p>Status: <strong>{scanning ? 'Scanning' : 'Idle'}</strong></p>
          <div className="row">
            <button onClick={handleStartScan}>Start scan</button>
            <button onClick={handleStopScan}>Stop scan</button>
            <button onClick={() => setRoute('diagnostics')}>Diagnostics</button>
          </div>
          <div className="cards">
            {devices.map((device) => (
              <button
                className="card"
                key={device.id}
                onClick={() => {
                  setSelectedDevice(device)
                  setRoute('detail')
                }}
              >
                <h3>{device.name}</h3>
                <p>Address: {device.address}</p>
                <p>RSSI: {device.rssi} dBm</p>
                <p>Status: {device.status}</p>
              </button>
            ))}
          </div>
        </section>
      )
    }

    if (route === 'detail') {
      return (
        <section className="panel">
          <h1>Device detail</h1>
          {selectedDevice ? (
            <>
              <p>Name: {selectedDevice.name}</p>
              <p>Address: {selectedDevice.address}</p>
              <p>Connection: {selectedDevice.status}</p>
              <p>RSSI: {selectedDevice.rssi} dBm</p>
            </>
          ) : <p>No device selected.</p>}
          <button onClick={() => setRoute('devices')}>Back</button>
        </section>
      )
    }

    return (
      <section className="panel">
        <h1>Diagnostics</h1>
        <div className="row">
          <button onClick={async () => setLogs(await addLog('Manual diagnostics ping'))}>Add test entry</button>
          <button onClick={async () => setLogs(await clearLogs())}>Clear logs</button>
          <button onClick={() => setRoute('devices')}>Back</button>
        </div>
        <div className="cards">
          {logs.map((log) => (
            <article key={log.id} className="card">
              <p>{new Date(log.timestamp).toLocaleString()}</p>
              <strong>{log.message}</strong>
            </article>
          ))}
        </div>
      </section>
    )
  })()

  return <main className="app">{page}</main>
}
