package com.wirelessoffice.ui.state

import com.wirelessoffice.model.BleDevice

data class DeviceListUiState(
    val isScanning: Boolean,
    val devices: List<BleDevice>
)
