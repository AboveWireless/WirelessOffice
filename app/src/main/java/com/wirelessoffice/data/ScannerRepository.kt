package com.wirelessoffice.data

import com.wirelessoffice.model.BleDevice
import kotlinx.coroutines.flow.StateFlow

interface ScannerRepository {
    val devices: StateFlow<List<BleDevice>>
    val isScanning: StateFlow<Boolean>
    suspend fun startScan()
    suspend fun stopScan()
}
