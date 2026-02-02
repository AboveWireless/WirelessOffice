package com.wirelessoffice.util

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

object DateFormat {
    private val formatter = DateTimeFormatter.ofPattern("MMM d, HH:mm:ss")
        .withZone(ZoneId.systemDefault())

    fun format(instant: Instant): String = formatter.format(instant)
}
