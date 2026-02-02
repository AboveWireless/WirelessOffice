package com.wirelessoffice.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wirelessoffice.data.DiagnosticsRepository
import com.wirelessoffice.ui.state.DiagnosticsUiState
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class DiagnosticsViewModel(private val diagnosticsRepository: DiagnosticsRepository) : ViewModel() {
    val uiState: StateFlow<DiagnosticsUiState> = diagnosticsRepository.entries
        .map { DiagnosticsUiState(entries = it) }
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5_000),
            DiagnosticsUiState(entries = diagnosticsRepository.entries.value)
        )

    fun addEntry(message: String) {
        viewModelScope.launch {
            diagnosticsRepository.log(message)
        }
    }

    fun clear() {
        viewModelScope.launch {
            diagnosticsRepository.clear()
        }
    }
}
