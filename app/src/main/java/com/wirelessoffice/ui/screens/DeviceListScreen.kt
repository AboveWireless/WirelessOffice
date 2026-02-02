package com.wirelessoffice.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.wirelessoffice.model.ConnectionStatus
import com.wirelessoffice.ui.viewmodel.DeviceListViewModel
import com.wirelessoffice.ui.viewmodel.DeviceListViewModelFactory

@Composable
fun DeviceListScreen(
    onDeviceSelected: () -> Unit,
    onDiagnostics: () -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: DeviceListViewModel = viewModel(factory = DeviceListViewModelFactory())
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = "Nearby devices", style = MaterialTheme.typography.headlineSmall)
                Text(
                    text = "Tap a device to connect and inspect services.",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            Spacer(modifier = Modifier.size(12.dp))
            AssistChip(
                onClick = {},
                label = { Text(text = if (uiState.isScanning) "Scanning" else "Idle") }
            )
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(uiState.devices) { device ->
                Card(onClick = onDeviceSelected) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = device.name, style = MaterialTheme.typography.titleMedium)
                        Text(text = "Address: ${device.address}")
                        Text(text = "RSSI: ${device.rssi} dBm")
                        Text(text = "Status: ${statusLabel(device.status)}")
                    }
                }
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(onClick = onDiagnostics) {
                Text(text = "Diagnostics")
            }
            if (uiState.isScanning) {
                Button(onClick = viewModel::stopScan) {
                    Text(text = "Stop scan")
                }
            } else {
                Button(onClick = viewModel::startScan) {
                    Text(text = "Start scan")
                }
            }
        }
    }
}

private fun statusLabel(status: ConnectionStatus): String = when (status) {
    ConnectionStatus.Available -> "Available"
    ConnectionStatus.Connecting -> "Connecting"
    ConnectionStatus.Connected -> "Connected"
}
