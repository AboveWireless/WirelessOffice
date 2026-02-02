package com.wirelessoffice.data

import com.wirelessoffice.model.DiagnosticsEntry
import kotlinx.coroutines.flow.StateFlow

interface DiagnosticsRepository {
    val entries: StateFlow<List<DiagnosticsEntry>>
    suspend fun log(message: String)
    suspend fun clear()
}
