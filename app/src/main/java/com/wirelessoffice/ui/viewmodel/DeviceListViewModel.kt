package com.wirelessoffice.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wirelessoffice.data.ScannerRepository
import com.wirelessoffice.ui.state.DeviceListUiState
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class DeviceListViewModel(private val scannerRepository: ScannerRepository) : ViewModel() {
    val uiState: StateFlow<DeviceListUiState> = combine(
        scannerRepository.devices,
        scannerRepository.isScanning
    ) { devices, scanning ->
        DeviceListUiState(
            isScanning = scanning,
            devices = devices
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        DeviceListUiState(
            isScanning = scannerRepository.isScanning.value,
            devices = scannerRepository.devices.value
        )
    )

    fun startScan() {
        viewModelScope.launch {
            scannerRepository.startScan()
        }
    }

    fun stopScan() {
        viewModelScope.launch {
            scannerRepository.stopScan()
        }
    }
}
