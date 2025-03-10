Add-Type -AssemblyName System.Drawing

$width = 800
$height = 1000
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Fondo blanco
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillRectangle($brush, 0, 0, $width, $height)

# Línea superior azul
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 70, 150))
$graphics.FillRectangle($brush, 0, 0, $width, 60)

# Logo banco (simulado)
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString("BANCO", $font, $brush, 20, 15)

# Título del comprobante
$font = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Bold)
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::Black)
$graphics.DrawString("Comprobante de Transferencia", $font, $brush, 20, 80)

# Información de la transferencia
$font = New-Object System.Drawing.Font("Arial", 12)
$y = 150
$items = @(
    "Fecha y hora: 25/02/2024 15:30:45",
    "Número de operación: 1234567890",
    "",
    "DATOS DE LA TRANSFERENCIA",
    "------------------------",
    "Cuenta origen: CC $ 123-456789/0",
    "Titular origen: JUAN PEREZ",
    "CBU origen: 0070999530004567890123",
    "",
    "Cuenta destino: CC $ 789-012345/6",
    "Titular destino: CARLOS RODRIGUEZ",
    "CBU destino: 0070999530009876543210",
    "",
    "IMPORTE: $ 1.500,00",
    "CONCEPTO: Pago de servicio",
    "",
    "Estado: TRANSFERENCIA EXITOSA"
)

foreach ($item in $items) {
    if ($item -match "^DATOS|^IMPORTE|^Estado") {
        $font = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    } else {
        $font = New-Object System.Drawing.Font("Arial", 12)
    }
    $graphics.DrawString($item, $font, $brush, 20, $y)
    $y += 30
}

# Pie de página
$font = New-Object System.Drawing.Font("Arial", 10)
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::Gray)
$graphics.DrawString("Este comprobante fue generado electrónicamente y es válido sin firma ni sello", $font, $brush, 20, $height - 40)

# Save the image
$bmp.Save("comprobante1.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Crear una segunda versión con datos diferentes
$graphics.FillRectangle((New-Object Drawing.SolidBrush([System.Drawing.Color]::White)), 0, 150, $width, $height - 190)
$y = 150
$items2 = @(
    "Fecha y hora: 25/02/2024 14:15:30",
    "Número de operación: 9876543210",
    "",
    "DATOS DE LA TRANSFERENCIA",
    "------------------------",
    "Cuenta origen: CC $ 789-543210/9",
    "Titular origen: MARIA GARCIA",
    "CBU origen: 0070999530009998887776",
    "",
    "Cuenta destino: CC $ 456-789012/3",
    "Titular destino: ANA LOPEZ",
    "CBU destino: 0070999530001112223334",
    "",
    "IMPORTE: $ 2.300,50",
    "CONCEPTO: Pago de servicio",
    "",
    "Estado: TRANSFERENCIA EXITOSA"
)

foreach ($item in $items2) {
    if ($item -match "^DATOS|^IMPORTE|^Estado") {
        $font = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    } else {
        $font = New-Object System.Drawing.Font("Arial", 12)
    }
    $graphics.DrawString($item, $font, $brush, 20, $y)
    $y += 30
}

# Save the second image
$bmp.Save("comprobante2.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Clean up
$graphics.Dispose()
$bmp.Dispose()
