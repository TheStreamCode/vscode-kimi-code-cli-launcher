param(
    [string]$OutputPath = $(Join-Path (Split-Path -Parent $PSScriptRoot) 'media/icon.png')
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function New-RoundedRect {
    param(
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [int]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

$mediaDirectory = Split-Path -Parent $OutputPath
if (!(Test-Path $mediaDirectory)) {
    New-Item -ItemType Directory -Path $mediaDirectory | Out-Null
}

$bitmap = New-Object System.Drawing.Bitmap 512, 512
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.Clear([System.Drawing.Color]::FromArgb(255, 11, 16, 32))

$background = New-RoundedRect -X 16 -Y 16 -Width 480 -Height 480 -Radius 88
$backgroundBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 25, 48))
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 31, 48, 80), 6)
$graphics.FillPath($backgroundBrush, $background)
$graphics.DrawPath($borderPen, $background)

$haloBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, 88, 181, 255))
$graphics.FillEllipse($haloBrush, 92, 92, 328, 328)

$outerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 36, 57, 74))
$outerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 77, 101, 118), 7)
$graphics.FillEllipse($outerBrush, 108, 108, 296, 296)
$graphics.DrawEllipse($outerPen, 108, 108, 296, 296)

$orbPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$orbPath.AddEllipse(122, 122, 268, 268)
$orbBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($orbPath)
$orbBrush.CenterColor = [System.Drawing.Color]::FromArgb(255, 145, 213, 255)
$orbBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 18, 107, 198))
$orbBrush.CenterPoint = New-Object System.Drawing.PointF(220, 198)
$orbBrush.FocusScales = New-Object System.Drawing.PointF(0.3, 0.3)
$graphics.FillPath($orbBrush, $orbPath)

$innerRingPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(115, 216, 241, 255), 3)
$graphics.DrawEllipse($innerRingPen, 126, 126, 260, 260)

$eyeGlowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 255, 255, 255))
$leftEyeGlow = New-RoundedRect -X 197 -Y 207 -Width 46 -Height 76 -Radius 23
$rightEyeGlow = New-RoundedRect -X 269 -Y 207 -Width 46 -Height 76 -Radius 23
$graphics.FillPath($eyeGlowBrush, $leftEyeGlow)
$graphics.FillPath($eyeGlowBrush, $rightEyeGlow)

$eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$leftEye = New-RoundedRect -X 205 -Y 216 -Width 30 -Height 58 -Radius 15
$rightEye = New-RoundedRect -X 277 -Y 216 -Width 30 -Height 58 -Radius 15
$graphics.FillPath($eyeBrush, $leftEye)
$graphics.FillPath($eyeBrush, $rightEye)

$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$rightEye.Dispose()
$leftEye.Dispose()
$eyeBrush.Dispose()
$rightEyeGlow.Dispose()
$leftEyeGlow.Dispose()
$eyeGlowBrush.Dispose()
$innerRingPen.Dispose()
$orbBrush.Dispose()
$orbPath.Dispose()
$outerPen.Dispose()
$outerBrush.Dispose()
$haloBrush.Dispose()
$borderPen.Dispose()
$backgroundBrush.Dispose()
$background.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Generated $OutputPath"
