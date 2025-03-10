Add-Type -AssemblyName System.Drawing

$width = 400
$height = 300
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Fill background
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::LightGray)
$graphics.FillRectangle($brush, 0, 0, $width, $height)

# Add text
$font = New-Object System.Drawing.Font("Arial", 16)
$brush = New-Object Drawing.SolidBrush([System.Drawing.Color]::DarkGray)
$text = "Imagen no disponible"
$size = $graphics.MeasureString($text, $font)
$x = ($width - $size.Width) / 2
$y = ($height - $size.Height) / 2
$graphics.DrawString($text, $font, $brush, $x, $y)

# Save the image
$bmp.Save("placeholder.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("comprobante1.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("comprobante2.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Clean up
$graphics.Dispose()
$bmp.Dispose()
