package com.wirelessoffice.model

import java.time.Instant

data class DiagnosticsEntry(
    val id: String,
    val message: String,
    val timestamp: Instant
)
