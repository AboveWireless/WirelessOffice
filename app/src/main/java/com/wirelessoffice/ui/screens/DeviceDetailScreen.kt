package com.wirelessoffice.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun DeviceDetailScreen(onBack: () -> Unit, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(text = "Device detail", style = MaterialTheme.typography.headlineSmall)
        Text(
            text = "Service discovery and characteristic read/write will appear here once BLE is wired up.",
            style = MaterialTheme.typography.bodyMedium
        )
        Card {
            Column(
                modifier = Modifier.padding(PaddingValues(16.dp)),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(text = "Connection state", style = MaterialTheme.typography.titleMedium)
                Text(text = "Status: Connected (mock)")
                Text(text = "Battery: 82% (mock)")
                Text(text = "Firmware: 1.1.111")
            }
        }
        Button(onClick = onBack) {
            Text(text = "Back to devices")
        }
    }
}
