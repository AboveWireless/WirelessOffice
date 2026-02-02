package com.wirelessoffice.data

import com.wirelessoffice.model.PermissionState
import kotlinx.coroutines.flow.StateFlow

interface PermissionsRepository {
    val permissions: StateFlow<PermissionState>
    suspend fun refresh()
}
