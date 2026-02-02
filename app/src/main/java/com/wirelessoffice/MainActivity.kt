package com.wirelessoffice

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.wirelessoffice.ui.WirelessOfficeApp
import com.wirelessoffice.ui.theme.WirelessOfficeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WirelessOfficeTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    WirelessOfficeRoot()
                }
            }
        }
    }
}

@Composable
private fun WirelessOfficeRoot() {
    val navController = rememberNavController()
    WirelessOfficeApp(navController = navController)
}
