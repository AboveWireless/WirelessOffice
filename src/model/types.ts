export type ConnectionStatus = 'Available' | 'Connecting' | 'Connected'

export type BleDevice = {
  id: string
  name: string
  address: string
  rssi: number
  status: ConnectionStatus
}

export type PermissionState = {
  bluetooth: boolean
  location: boolean
  camera: boolean
}

export type DiagnosticsEntry = {
  id: string
  message: string
  timestamp: string
}
