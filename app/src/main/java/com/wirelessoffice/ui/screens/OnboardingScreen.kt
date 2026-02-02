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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.wirelessoffice.ui.viewmodel.OnboardingViewModel
import com.wirelessoffice.ui.viewmodel.OnboardingViewModelFactory

@Composable
fun OnboardingScreen(onContinue: () -> Unit, modifier: Modifier = Modifier) {
    val viewModel: OnboardingViewModel = viewModel(factory = OnboardingViewModelFactory())
    val uiState by viewModel.uiState.collectAsState()
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "Welcome to Wireless Office",
                style = MaterialTheme.typography.headlineMedium
            )
            Text(
                text = "Set up Bluetooth permissions, confirm device readiness, and start scanning for nearby devices.",
                style = MaterialTheme.typography.bodyLarge
            )
            Card {
                Column(
                    modifier = Modifier.padding(PaddingValues(16.dp)),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "Setup checklist", style = MaterialTheme.typography.titleMedium)
                    Text(text = "• Bluetooth enabled: ${statusLabel(uiState.permissions.bluetooth)}")
                    Text(text = "• Location permission: ${statusLabel(uiState.permissions.location)}")
                    Text(text = "• Camera permission: ${statusLabel(uiState.permissions.camera)}")
                }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(onClick = viewModel::refreshPermissions) {
                Text(text = if (uiState.isRefreshing) "Refreshing..." else "Refresh permissions")
            }
            Button(onClick = onContinue) {
                Text(text = "Start device scan")
            }
        }
    }
}

private fun statusLabel(granted: Boolean): String = if (granted) "Ready" else "Needs access"
