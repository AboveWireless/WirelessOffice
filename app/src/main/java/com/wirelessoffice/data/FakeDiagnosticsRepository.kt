package com.wirelessoffice.data

import com.wirelessoffice.model.DiagnosticsEntry
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.Instant
import java.util.UUID

class FakeDiagnosticsRepository : DiagnosticsRepository {
    private val _entries = MutableStateFlow(
        listOf(
            DiagnosticsEntry(
                id = UUID.randomUUID().toString(),
                message = "App launched",
                timestamp = Instant.now()
            ),
            DiagnosticsEntry(
                id = UUID.randomUUID().toString(),
                message = "BLE adapter ready",
                timestamp = Instant.now()
            )
        )
    )

    override val entries: StateFlow<List<DiagnosticsEntry>> = _entries.asStateFlow()

    override suspend fun log(message: String) {
        val newEntry = DiagnosticsEntry(
            id = UUID.randomUUID().toString(),
            message = message,
            timestamp = Instant.now()
        )
        _entries.value = _entries.value + newEntry
    }

    override suspend fun clear() {
        _entries.value = emptyList()
    }
}
