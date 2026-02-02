package com.wirelessoffice.model

data class PermissionState(
    val bluetooth: Boolean,
    val location: Boolean,
    val camera: Boolean
)
