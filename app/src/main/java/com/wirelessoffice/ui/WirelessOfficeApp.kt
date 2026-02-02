package com.wirelessoffice.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.wirelessoffice.ui.screens.DiagnosticsScreen
import com.wirelessoffice.ui.screens.DeviceDetailScreen
import com.wirelessoffice.ui.screens.DeviceListScreen
import com.wirelessoffice.ui.screens.OnboardingScreen

sealed class AppRoute(val route: String) {
    data object Onboarding : AppRoute("onboarding")
    data object DeviceList : AppRoute("devices")
    data object DeviceDetail : AppRoute("device_detail")
    data object Diagnostics : AppRoute("diagnostics")
}

@Composable
fun WirelessOfficeApp(navController: NavHostController, modifier: Modifier = Modifier) {
    Scaffold(containerColor = MaterialTheme.colorScheme.background) { padding ->
        NavHost(
            navController = navController,
            startDestination = AppRoute.Onboarding.route,
            modifier = modifier.padding(padding)
        ) {
            composable(AppRoute.Onboarding.route) {
                OnboardingScreen(
                    onContinue = { navController.navigate(AppRoute.DeviceList.route) }
                )
            }
            composable(AppRoute.DeviceList.route) {
                DeviceListScreen(
                    onDeviceSelected = { navController.navigate(AppRoute.DeviceDetail.route) },
                    onDiagnostics = { navController.navigate(AppRoute.Diagnostics.route) }
                )
            }
            composable(AppRoute.DeviceDetail.route) {
                DeviceDetailScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(AppRoute.Diagnostics.route) {
                DiagnosticsScreen(
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
