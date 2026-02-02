package com.wirelessoffice.ui.state

import com.wirelessoffice.model.PermissionState

data class OnboardingUiState(
    val permissions: PermissionState,
    val isRefreshing: Boolean
)
