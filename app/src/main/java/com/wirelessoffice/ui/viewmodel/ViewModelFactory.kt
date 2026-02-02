package com.wirelessoffice.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.wirelessoffice.core.ServiceLocator

class OnboardingViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(OnboardingViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return OnboardingViewModel(ServiceLocator.permissionsRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

class DeviceListViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DeviceListViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return DeviceListViewModel(ServiceLocator.scannerRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

class DiagnosticsViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DiagnosticsViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return DiagnosticsViewModel(ServiceLocator.diagnosticsRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
