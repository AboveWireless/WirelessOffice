; ---------------------------------------------------------------------------
; Bank-Register PDF → Excel Matcher
; Hotkey: Ctrl + Alt + Win + Z   (^!#z)
; ---------------------------------------------------------------------------
#SingleInstance Force
SetBatchLines, -1

; ---------------------------------------------------------------------------
; GLOBAL VARIABLES
; ---------------------------------------------------------------------------

global xl, targetWB, sheet, defaultYear := 2022

; Coordinates used repeatedly in Nitro's toolbar
priceToolX  := 99
priceToolY  := 36
highlightX  := 106
highlightY  := 37

; Fill color constants
greenFill   := 6605692  ; RGB(124,203,100)

; ---------------------------------------------------------------------------
; HOTKEYS
; ---------------------------------------------------------------------------
Esc::ExitApp

^!#z::
    Main()
return

; ---------------------------------------------------------------------------
; MAIN LOGIC
; ---------------------------------------------------------------------------
Main() {
    global xl, targetWB, sheet, defaultYear

    ; Connect to Excel
    if !InitExcel()
        return

    ; Activate Nitro and capture price position
    hwndFrame := ActivateNitro()
    if !hwndFrame
        return
    MouseGetPos, PriceX, PriceY
    hwndNitro := GetNitroViewHwnd(hwndFrame)
    if (!hwndNitro) {
        MsgBox 48, Error, Couldn’t find Nitro’s view window – stopping.
        return
    }

    Loop {
        ; Copy date from PDF and filter Excel
        dateString := CopyDateFromPDF(PriceX, PriceY)
        if (!dateString)
            break
        if (!FilterExcelByDate(dateString))
            break

        ; Copy price from PDF
        searchValue := CopyPriceFromPDF(PriceX, PriceY)
        if (searchValue = "") {
            MsgBox 48, Error, No price value copied – stopping.
            break
        }

        ; Find matching value in Excel
        found := FindMatchingValue(searchValue)

        ; Highlight block or drag always
        HighlightBlock(found, PriceX, PriceY, hwndFrame)
        DragBlock(PriceX, PriceY)

        ; Scroll to next price in PDF
        atBottom := false
        foundNext := ScrollToNextPrice(hwndNitro)
        if (foundNext = "bottom") {
            atBottom := true
        }

        ; Exit conditions
        if (atBottom) {
            MsgBox Reached the bottom of the visible PDF page.`nScript stopped.
            break
        } else if (!foundNext) {
            MsgBox No new price found.`nScript stopped.
            break
        }
    }
}

; ---------------------------------------------------------------------------
; HELPER FUNCTIONS
; ---------------------------------------------------------------------------
InitExcel() {
    global xl, targetWB, sheet

    try xl := ComObjActive("Excel.Application")
    catch {
        MsgBox 48, Error, Excel isn’t running – start Excel and try again.
        return false
    }

    wbName := "Bank Register 2022.xlsx"
    filePath := "E:\\OneDrive - Above Wireless LLC\\Personal\\Quickbooks Docs\\Bank Register\\" . wbName

    for wb in xl.Workbooks
        if (wb.Name = wbName) {
            targetWB := wb
            break
        }
    if !IsObject(targetWB) {
        try targetWB := xl.Workbooks.Open(filePath)
        catch {
            MsgBox 48, Error, Couldn’t open “%wbName%” at:`n%filePath%
            return false
        }
    }
    sheet := targetWB.ActiveSheet
    return true
}

ActivateNitro() {
    WinActivate, ahk_exe NitroPDF.exe
    WinWaitActive, ahk_exe NitroPDF.exe,, 2
    if (ErrorLevel)
        return 0
    WinGetPos, winX, winY, winW, winH, A
    WinGet, hwndFrame, ID, A
    return hwndFrame
}

CopyDateFromPDF(x, y) {
    global defaultYear
    ControlClick, x99 y36, , , Left, 1
    ControlClick, x102 y72, , , Left, 1
    DateX := x - 800
    DateY := y
    MouseClick, Left, %DateX%, %DateY%, 3
    Sleep 200
    Clipboard := ""
    Sleep 100
    Send ^c
    ClipWait 1
    dateText := Trim(Clipboard)
    if !RegExMatch(dateText, "(\d{1,2})[/-](\d{1,2})", d) {
        MsgBox 48, Error, Couldn’t parse date “%dateText%”.
        return ""
    }
    month := d1 + 0
    day   := d2 + 0
    return Format("{:02}/{:02}/{:04}", month, day, defaultYear)
}

FilterExcelByDate(dateString) {
    global targetWB, sheet
    try {
        targetWB.Activate
        sheet.Range("A1").AutoFilter(1, dateString)
    } catch {
        MsgBox 48, Error, Excel filter error – stopping.
        return false
    }
    return true
}

CopyPriceFromPDF(x, y) {
    MouseMove, %x%, %y%, 0
    MouseClick, Left, %x%, %y%, 3
    Sleep 200
    Clipboard := ""
    Send ^c
    ClipWait 1
    return Trim(StrReplace(StrReplace(Clipboard, "$"), ",", ""))
}

FindMatchingValue(value) {
    global sheet, greenFill
    WinActivate, ahk_class XLMAIN
    WinWaitActive, ahk_class XLMAIN
    Sleep 100
    try {
        cell := sheet.Columns(6).Find(value, , , 1) ; xlWhole
    } catch {
        cell := ""
    }
    if IsObject(cell) {
        rowNum := cell.Row
        fill := sheet.Cells(rowNum, 6).Interior.Color
        if (fill = greenFill)
            return true
        sheet.Cells(rowNum, 6).Interior.Color := 65535
        sheet.Range("A" rowNum ":K" rowNum).Interior.Color := greenFill
        sheet.Cells(rowNum, 6).Activate
        return true
    }
    return false
}

HighlightBlock(found, x, y, hwndFrame) {
    if (found)
        return
    ControlClick, x106 y37, , , Left, 1
    ControlClick, x514 y76, , , Left, 1
    Sleep 100
    MouseMove, %x%, %y%, 0
    Sleep 100
    Xx2 := x - 840
    MouseClick, Left,,, 1, 0, D
    Sleep 100
    MouseMove, %Xx2%, %y%, 1
    Sleep 100
    MouseClick, Left,,, 1, 0, U
    Sleep 100
    MouseMove, %x%, %y%, 0
    Sleep 100
    XxRightClick := x - 30
    MouseClick, Right, %XxRightClick%, %y%
    Sleep 150
    XxDrop := XxRightClick + 100
    YyDrop := y - 40
    MouseClick, Left, %XxDrop%, %YyDrop%
    Sleep 100
    XxRed := XxDrop + 48
    YyRed := YyDrop + 66
    MouseClick, Left, %XxRed%, %YyRed%
    Sleep 200
    ControlClick, x104 y39, , , Left, 1
    ControlClick, x101 y72, , , Left, 1
    Sleep 200
    MouseMove, %x%, %y%, 5
    Sleep 200
}

DragBlock(x, y) {
    ControlClick, x97 y37, , , Left, 1
    ControlClick, x511 y73, , , Left, 1
    Sleep 100
    MouseMove, %x%, %y%, 0
    Sleep 100
    Xx2 := x - 820
    MouseClick, Left,,, 1, 0, D
    Sleep 100
    MouseMove, %Xx2%, %y%, 1
    Sleep 100
    MouseClick, Left,,, 1, 0, U
    Sleep 100
    ControlClick, x99 y36, , , Left, 1
    ControlClick, x102 y72, , , Left, 1
    MouseMove, %x%, %y%, 0
}

ScrollToNextPrice(hwnd) {
    Clipboard := ""
    CoordMode, Mouse, Screen
    MouseGetPos, x, y
    step := 20
    jump := 0
    maxJumps := 5

    Loop {
        y += step
        MouseMove, %x%, %y%, 0
        if (IsScrolledToBottom(hwnd))
            return "bottom"
        Sleep 30
        Click 3
        Sleep 30
        Clipboard := ""
        Send ^c
        t0 := A_TickCount
        Loop {
            if (Clipboard != "")
                break
            if (A_TickCount - t0 > 250)
                break
            Sleep 10
        }
        copied := Trim(Clipboard)
        Clipboard := ""
        if RegExMatch(copied, "\$?\d{1,3}(,\d{3})*(\.\d{2})|\$?\d+\.\d{2}")
            return true
        step := 10
        jump++
        if (jump >= maxJumps)
            break
    }
    return false
}

; ---------------------------------------------------------------------------
; Existing helper functions from original script
; ---------------------------------------------------------------------------
IsScrolledToBottom(hwnd) {
    static SB_VERT := 1
    VarSetCapacity(si, 28, 0)
    NumPut(28,  si, 0,  "UInt")
    NumPut(0x17, si, 4,  "UInt")       ; SIF_ALL
    if DllCall("User32.dll\GetScrollInfo", "ptr", hwnd, "int", SB_VERT, "ptr", &si) {
        pos  := NumGet(si, 20, "Int")
        page := NumGet(si, 24, "UInt")
        max  := NumGet(si, 16, "Int")
        return (pos >= max - page)
    }
    return false
}

GetNitroViewHwnd(hwndFrame) {
    ControlGetFocus, foc, ahk_id %hwndFrame%
    if (foc != "" && RegExMatch(foc, "^AfxFrameOrView")) {
        ControlGet, hwnd, Hwnd,, %foc%, ahk_id %hwndFrame%
        if (hwnd)
            return hwnd
    }

    WinGet, list, ControlListHwnd, ahk_id %hwndFrame%
    Loop Parse, list, `n
    {
        hwnd := A_LoopField
        WinGetClass, cls, ahk_id %hwnd%
        if (RegExMatch(cls, "^AfxFrameOrView"))
            return hwnd
    }
    return 0
}
