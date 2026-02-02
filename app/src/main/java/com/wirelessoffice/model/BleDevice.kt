package com.wirelessoffice.model

data class BleDevice(
    val id: String,
    val name: String,
    val address: String,
    val rssi: Int,
    val status: ConnectionStatus
)

enum class ConnectionStatus {
    Available,
    Connecting,
    Connected
}
