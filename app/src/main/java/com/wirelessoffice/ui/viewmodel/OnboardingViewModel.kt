package com.wirelessoffice.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wirelessoffice.data.PermissionsRepository
import com.wirelessoffice.ui.state.OnboardingUiState
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class OnboardingViewModel(private val permissionsRepository: PermissionsRepository) : ViewModel() {
    private val isRefreshing = MutableStateFlow(false)

    val uiState: StateFlow<OnboardingUiState> = combine(
        permissionsRepository.permissions,
        isRefreshing
    ) { permissions, refreshing ->
        OnboardingUiState(permissions = permissions, isRefreshing = refreshing)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        OnboardingUiState(
            permissions = permissionsRepository.permissions.value,
            isRefreshing = false
        )
    )

    fun refreshPermissions() {
        viewModelScope.launch {
            isRefreshing.value = true
            permissionsRepository.refresh()
            isRefreshing.value = false
        }
    }
}
