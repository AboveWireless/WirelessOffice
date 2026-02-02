package com.wirelessoffice.core

import com.wirelessoffice.data.DiagnosticsRepository
import com.wirelessoffice.data.FakeDiagnosticsRepository
import com.wirelessoffice.data.FakePermissionsRepository
import com.wirelessoffice.data.FakeScannerRepository
import com.wirelessoffice.data.PermissionsRepository
import com.wirelessoffice.data.ScannerRepository

object ServiceLocator {
    val scannerRepository: ScannerRepository by lazy { FakeScannerRepository() }
    val permissionsRepository: PermissionsRepository by lazy { FakePermissionsRepository() }
    val diagnosticsRepository: DiagnosticsRepository by lazy { FakeDiagnosticsRepository() }
}
