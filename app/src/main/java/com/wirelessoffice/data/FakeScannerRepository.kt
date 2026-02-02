package com.wirelessoffice.data

import com.wirelessoffice.model.BleDevice
import com.wirelessoffice.model.ConnectionStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

class FakeScannerRepository : ScannerRepository {
    private val _devices = MutableStateFlow(sampleDevices())
    private val _isScanning = MutableStateFlow(false)

    override val devices: StateFlow<List<BleDevice>> = _devices.asStateFlow()
    override val isScanning: StateFlow<Boolean> = _isScanning.asStateFlow()

    override suspend fun startScan() {
        _isScanning.value = true
        delay(600)
        _devices.value = sampleDevices().shuffled()
    }

    override suspend fun stopScan() {
        _isScanning.value = false
    }

    private fun sampleDevices(): List<BleDevice> {
        return listOf(
            BleDevice(
                id = UUID.randomUUID().toString(),
                name = "Dillon Tower A1",
                address = "C8:2B:96:AA:01:11",
                rssi = -62,
                status = ConnectionStatus.Available
            ),
            BleDevice(
                id = UUID.randomUUID().toString(),
                name = "Dillon Tower B3",
                address = "C8:2B:96:AA:02:FF",
                rssi = -70,
                status = ConnectionStatus.Connected
            ),
            BleDevice(
                id = UUID.randomUUID().toString(),
                name = "Dillon Tower C7",
                address = "C8:2B:96:AA:03:8C",
                rssi = -81,
                status = ConnectionStatus.Available
            )
        )
    }
}
