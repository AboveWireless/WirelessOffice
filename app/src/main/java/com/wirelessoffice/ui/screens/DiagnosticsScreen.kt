package com.wirelessoffice.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.wirelessoffice.ui.viewmodel.DiagnosticsViewModel
import com.wirelessoffice.ui.viewmodel.DiagnosticsViewModelFactory
import com.wirelessoffice.util.DateFormat

@Composable
fun DiagnosticsScreen(onBack: () -> Unit, modifier: Modifier = Modifier) {
    val viewModel: DiagnosticsViewModel = viewModel(factory = DiagnosticsViewModelFactory())
    val uiState by viewModel.uiState.collectAsState()
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(text = "Diagnostics", style = MaterialTheme.typography.headlineSmall)
        Text(
            text = "Track BLE state, RSSI history, and logs here. Export uses the cache provider when implemented.",
            style = MaterialTheme.typography.bodyMedium
        )
        Card {
            Column(
                modifier = Modifier.padding(PaddingValues(16.dp)),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(text = "BLE status", style = MaterialTheme.typography.titleMedium)
                Text(text = "Scanning: Active (mock)")
                Text(text = "Last error: None")
                Text(text = "Devices seen: 3")
            }
        }
        Text(text = "Recent events", style = MaterialTheme.typography.titleMedium)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(uiState.entries) { entry ->
                Card {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(text = DateFormat.format(entry.timestamp))
                        Text(text = entry.message)
                    }
                }
            }
        }
        Button(onClick = { viewModel.addEntry("Manual diagnostics ping") }) {
            Text(text = "Add test entry")
        }
        Button(onClick = viewModel::clear) {
            Text(text = "Clear logs")
        }
        Button(onClick = onBack) {
            Text(text = "Back")
        }
    }
}
