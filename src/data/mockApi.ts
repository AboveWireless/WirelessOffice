import type { BleDevice, DiagnosticsEntry, PermissionState } from '../model/types'

const seedDevices: BleDevice[] = [
  { id: crypto.randomUUID(), name: 'Dillon Tower A1', address: 'C8:2B:96:AA:01:11', rssi: -62, status: 'Available' },
  { id: crypto.randomUUID(), name: 'Dillon Tower B3', address: 'C8:2B:96:AA:02:FF', rssi: -70, status: 'Connected' },
  { id: crypto.randomUUID(), name: 'Dillon Tower C7', address: 'C8:2B:96:AA:03:8C', rssi: -81, status: 'Available' }
]

let permissions: PermissionState = { bluetooth: true, location: false, camera: true }
let logs: DiagnosticsEntry[] = [
  { id: crypto.randomUUID(), message: 'App launched', timestamp: new Date().toISOString() },
  { id: crypto.randomUUID(), message: 'Scanner initialized', timestamp: new Date().toISOString() }
]

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function fetchDevices(): Promise<BleDevice[]> {
  await wait(250)
  return [...seedDevices].sort(() => Math.random() - 0.5)
}

export async function refreshPermissions(): Promise<PermissionState> {
  await wait(250)
  permissions = { ...permissions, location: true }
  return permissions
}

export async function fetchPermissions(): Promise<PermissionState> {
  await wait(150)
  return permissions
}

export async function fetchLogs(): Promise<DiagnosticsEntry[]> {
  await wait(100)
  return logs
}

export async function addLog(message: string): Promise<DiagnosticsEntry[]> {
  logs = [{ id: crypto.randomUUID(), message, timestamp: new Date().toISOString() }, ...logs]
  return logs
}

export async function clearLogs(): Promise<DiagnosticsEntry[]> {
  logs = []
  return logs
}
