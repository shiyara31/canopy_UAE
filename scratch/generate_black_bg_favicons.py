import os
import cv2
import numpy as np
from PIL import Image

# Output directories
root_dir = r"c:\Users\acer\OneDrive\Documents\canopy UAE"
images_dir = os.path.join(root_dir, "images")

# 1. Generate favicon.svg
# Canvas 512x512, background #0c0d0e (or #000000), rounded rect rx="96" or square rx="64"
# Scaled logo centered: original is 396x465.
# Target logo height in 512x512: 360px -> scale = 360 / 465 = 0.7741935
# Logo width after scale = 396 * 0.7741935 = 306.58
# offsetX = (512 - 306.58)/2 = 102.71
# offsetY = (512 - 360)/2 = 76.0

svg_favicon_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#0c0d0e"/>
  <g transform="translate(102.7, 76) scale(0.7742)" fill="#FFFFFF" fill-rule="evenodd">
    <path d="M 386 274 L 383 274 L 371 286 L 371 287 L 357 300 L 350 308 L 344 312 L 341 316 L 338 317 L 323 329 L 321 329 L 312 335 L 309 339 L 305 339 L 296 344 L 293 347 L 292 387 L 294 392 L 300 391 L 312 384 L 315 384 L 324 380 L 328 376 L 332 375 L 335 372 L 341 370 L 344 367 L 350 364 L 354 360 L 357 359 L 361 354 L 363 354 L 373 346 L 387 333 Z"/>
    <path d="M 318 84 L 312 87 L 308 87 L 305 89 L 302 89 L 298 92 L 295 92 L 287 95 L 281 99 L 277 99 L 262 105 L 259 105 L 254 108 L 243 111 L 235 115 L 231 115 L 224 119 L 218 120 L 214 123 L 211 123 L 209 125 L 208 419 L 209 421 L 212 423 L 220 425 L 228 429 L 234 430 L 241 434 L 245 434 L 251 438 L 254 438 L 262 441 L 266 444 L 272 445 L 274 447 L 277 447 L 279 449 L 286 450 L 290 453 L 301 456 L 306 459 L 311 460 L 314 462 L 319 462 L 318 450 L 312 447 L 307 446 L 297 441 L 287 438 L 280 435 L 278 433 L 279 403 L 278 114 L 281 111 L 291 108 L 296 105 L 309 101 L 312 98 L 317 98 L 320 94 L 320 90 Z"/>
    <path d="M 344 3 L 215 3 L 183 6 L 178 8 L 171 9 L 169 8 L 166 11 L 161 11 L 135 20 L 131 23 L 124 25 L 113 31 L 108 35 L 104 36 L 79 55 L 71 63 L 71 65 L 69 67 L 67 67 L 56 78 L 55 81 L 45 92 L 44 95 L 40 99 L 39 103 L 34 109 L 33 113 L 29 118 L 23 131 L 23 134 L 20 139 L 13 160 L 12 164 L 12 170 L 9 180 L 8 191 L 8 223 L 10 240 L 12 245 L 12 250 L 13 254 L 16 260 L 16 264 L 18 271 L 22 276 L 24 285 L 26 287 L 26 289 L 32 300 L 39 308 L 39 311 L 43 315 L 45 319 L 49 324 L 69 344 L 74 348 L 78 350 L 82 354 L 85 354 L 89 359 L 94 361 L 100 366 L 102 366 L 108 370 L 131 380 L 146 385 L 154 386 L 161 389 L 188 394 L 197 393 L 196 352 L 181 349 L 159 340 L 146 333 L 140 328 L 137 327 L 127 319 L 108 300 L 107 297 L 102 292 L 101 289 L 96 283 L 96 281 L 92 275 L 90 269 L 86 263 L 86 261 L 83 257 L 82 249 L 80 246 L 77 235 L 77 228 L 74 214 L 74 180 L 76 176 L 77 170 L 77 163 L 80 155 L 81 147 L 86 136 L 86 132 L 90 128 L 91 123 L 101 106 L 103 100 L 110 91 L 116 85 L 119 80 L 139 61 L 149 54 L 152 50 L 158 48 L 162 45 L 166 44 L 175 38 L 184 34 L 188 34 L 194 31 L 201 29 L 206 29 L 215 26 L 228 25 L 236 25 L 245 27 L 261 34 L 263 36 L 265 36 L 269 39 L 279 44 L 293 49 L 305 56 L 316 61 L 325 64 L 339 72 L 344 74 Z"/>
  </g>
</svg>
'''

with open(os.path.join(root_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_favicon_content)
with open(os.path.join(images_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_favicon_content)

print("Saved favicon.svg in root and images/")

# 2. Render high-res bitmap (2048x2048) for super crisp raster generation
canvas_size = 2048
scale_factor = canvas_size / 512.0
bg_color = (14, 13, 12) # BGR for #0c0d0e
corner_radius = int(96 * scale_factor)

# Create image with alpha
img = np.zeros((canvas_size, canvas_size, 4), dtype=np.uint8)

# Draw rounded rectangle mask
mask = np.zeros((canvas_size, canvas_size), dtype=np.uint8)
cv2.rectangle(mask, (corner_radius, 0), (canvas_size - corner_radius, canvas_size), 255, -1)
cv2.rectangle(mask, (0, corner_radius), (canvas_size, canvas_size - corner_radius), 255, -1)
cv2.circle(mask, (corner_radius, corner_radius), corner_radius, 255, -1)
cv2.circle(mask, (canvas_size - corner_radius, corner_radius), corner_radius, 255, -1)
cv2.circle(mask, (corner_radius, canvas_size - corner_radius), corner_radius, 255, -1)
cv2.circle(mask, (canvas_size - corner_radius, canvas_size - corner_radius), corner_radius, 255, -1)

# Apply background color
img[mask > 0, 0] = 12 # R (PIL: RGBA)
img[mask > 0, 1] = 13 # G
img[mask > 0, 2] = 14 # B
img[mask > 0, 3] = 255

# Parse SVG paths and draw them at 2048x2048
# Function to parse SVG path string of 'M ... L ... Z'
def parse_path(d_str):
    pts = []
    tokens = d_str.strip().split()
    i = 0
    while i < len(tokens):
        cmd = tokens[i]
        if cmd in ('M', 'L'):
            x = float(tokens[i+1])
            y = float(tokens[i+2])
            pts.append((x, y))
            i += 3
        elif cmd == 'Z':
            i += 1
        else:
            i += 1
    return np.array(pts, dtype=np.float32)

path1_str = "M 386 274 L 383 274 L 371 286 L 371 287 L 357 300 L 350 308 L 344 312 L 341 316 L 338 317 L 323 329 L 321 329 L 312 335 L 309 339 L 305 339 L 296 344 L 293 347 L 292 387 L 294 392 L 300 391 L 312 384 L 315 384 L 324 380 L 328 376 L 332 375 L 335 372 L 341 370 L 344 367 L 350 364 L 354 360 L 357 359 L 361 354 L 363 354 L 373 346 L 387 333 Z"
path2_str = "M 318 84 L 312 87 L 308 87 L 305 89 L 302 89 L 298 92 L 295 92 L 287 95 L 281 99 L 277 99 L 262 105 L 259 105 L 254 108 L 243 111 L 235 115 L 231 115 L 224 119 L 218 120 L 214 123 L 211 123 L 209 125 L 208 419 L 209 421 L 212 423 L 220 425 L 228 429 L 234 430 L 241 434 L 245 434 L 251 438 L 254 438 L 262 441 L 266 444 L 272 445 L 274 447 L 277 447 L 279 449 L 286 450 L 290 453 L 301 456 L 306 459 L 311 460 L 314 462 L 319 462 L 318 450 L 312 447 L 307 446 L 297 441 L 287 438 L 280 435 L 278 433 L 279 403 L 278 114 L 281 111 L 291 108 L 296 105 L 309 101 L 312 98 L 317 98 L 320 94 L 320 90 Z"
path3_str = "M 344 3 L 215 3 L 183 6 L 178 8 L 171 9 L 169 8 L 166 11 L 161 11 L 135 20 L 131 23 L 124 25 L 113 31 L 108 35 L 104 36 L 79 55 L 71 63 L 71 65 L 69 67 L 67 67 L 56 78 L 55 81 L 45 92 L 44 95 L 40 99 L 39 103 L 34 109 L 33 113 L 29 118 L 23 131 L 23 134 L 20 139 L 13 160 L 12 164 L 12 170 L 9 180 L 8 191 L 8 223 L 10 240 L 12 245 L 12 250 L 13 254 L 16 260 L 16 264 L 18 271 L 22 276 L 24 285 L 26 287 L 26 289 L 32 300 L 39 308 L 39 311 L 43 315 L 45 319 L 49 324 L 69 344 L 74 348 L 78 350 L 82 354 L 85 354 L 89 359 L 94 361 L 100 366 L 102 366 L 108 370 L 131 380 L 146 385 L 154 386 L 161 389 L 188 394 L 197 393 L 196 352 L 181 349 L 159 340 L 146 333 L 140 328 L 137 327 L 127 319 L 108 300 L 107 297 L 102 292 L 101 289 L 96 283 L 96 281 L 92 275 L 90 269 L 86 263 L 86 261 L 83 257 L 82 249 L 80 246 L 77 235 L 77 228 L 74 214 L 74 180 L 76 176 L 77 170 L 77 163 L 80 155 L 81 147 L 86 136 L 86 132 L 90 128 L 91 123 L 101 106 L 103 100 L 110 91 L 116 85 L 119 80 L 139 61 L 149 54 L 152 50 L 158 48 L 162 45 L 166 44 L 175 38 L 184 34 L 188 34 L 194 31 L 201 29 L 206 29 L 215 26 L 228 25 L 236 25 L 245 27 L 261 34 L 263 36 L 265 36 L 269 39 L 279 44 L 293 49 L 305 56 L 316 61 L 325 64 L 339 72 L 344 74 Z"

# Transform and draw polygons at 4x resolution
tx = 102.7 * scale_factor
ty = 76.0 * scale_factor
scale = 0.7742 * scale_factor

logo_mask = np.zeros((canvas_size, canvas_size), dtype=np.uint8)

for p_str in [path1_str, path2_str, path3_str]:
    pts = parse_path(p_str)
    pts_trans = (pts * scale + np.array([tx, ty])).astype(np.int32)
    cv2.fillPoly(logo_mask, [pts_trans], 255, lineType=cv2.LINE_AA)

# Overlay white logo
for c in range(3):
    img[logo_mask > 0, c] = 255

pil_master = Image.fromarray(img, mode="RGBA")

# Sizes to generate
sizes = [
    ("favicon-16x16.png", 16),
    ("favicon-32x32.png", 32),
    ("favicon-48x48.png", 48),
    ("favicon-64x64.png", 64),
    ("favicon-180x180.png", 180),
    ("apple-touch-icon.png", 180),
    ("favicon-192x192.png", 192),
    ("favicon-512x512.png", 512),
    ("favicon.png", 512),
    ("canopy_logo_mark.png", 512)
]

for name, size in sizes:
    resized = pil_master.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(root_dir, name))
    resized.save(os.path.join(images_dir, name))
    print(f"Generated {name} ({size}x{size})")

# Generate multi-size favicon.ico
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
pil_master.save(os.path.join(root_dir, "favicon.ico"), format="ICO", sizes=ico_sizes)
pil_master.save(os.path.join(images_dir, "favicon.ico"), format="ICO", sizes=ico_sizes)
print("Generated favicon.ico with all standard resolutions!")
