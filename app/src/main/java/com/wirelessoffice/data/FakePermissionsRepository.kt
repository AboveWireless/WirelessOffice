package com.wirelessoffice.data

import com.wirelessoffice.model.PermissionState
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FakePermissionsRepository : PermissionsRepository {
    private val _permissions = MutableStateFlow(
        PermissionState(
            bluetooth = true,
            location = false,
            camera = true
        )
    )

    override val permissions: StateFlow<PermissionState> = _permissions.asStateFlow()

    override suspend fun refresh() {
        delay(250)
        _permissions.value = _permissions.value.copy(location = true)
    }
}
