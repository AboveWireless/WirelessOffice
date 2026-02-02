package com.wirelessoffice.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = BluePrimary,
    secondary = BlueSecondary,
    tertiary = TealAccent,
    background = GrayBackground,
    surface = SurfaceLight,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1A1C1E),
    onSurface = Color(0xFF1A1C1E)
)

private val DarkColors = darkColorScheme(
    primary = BlueSecondary,
    secondary = BluePrimary,
    tertiary = TealAccent,
    background = DarkBackground,
    surface = Color(0xFF1A1C1E),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFFE3E3E3),
    onSurface = Color(0xFFE3E3E3)
)

@Composable
fun WirelessOfficeTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colors: ColorScheme = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        content = content
    )
}
