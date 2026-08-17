import cv2
import numpy as np
from PIL import Image

# Read logo.jpeg
img = cv2.imread('logo.jpeg')
monogram = img[125:590, :]

# Calculate green mask with high accuracy
g = monogram[:, :, 1].astype(float)
r = monogram[:, :, 0].astype(float)
b = monogram[:, :, 2].astype(float)

green_diff = g - 0.55 * r - 0.45 * b
green_diff_norm = np.clip(green_diff * 4.0, 0, 255).astype(np.uint8)

_, thresh = cv2.threshold(green_diff_norm, 25, 255, cv2.THRESH_BINARY)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
all_pts = np.vstack([c.reshape(-1, 2) for c in contours if cv2.contourArea(c) > 200])

min_x, min_y = all_pts.min(axis=0)
max_x, max_y = all_pts.max(axis=0)

padding = 8
min_x = max(0, min_x - padding)
min_y = max(0, min_y - padding)
max_x = min(monogram.shape[1] - 1, max_x + padding)
max_y = min(monogram.shape[0] - 1, max_y + padding)

crop_monogram = monogram[min_y:max_y+1, min_x:max_x+1]
crop_thresh = thresh[min_y:max_y+1, min_x:max_x+1]
alpha = cv2.GaussianBlur(crop_thresh, (3, 3), 0)

h, w = crop_monogram.shape[:2]

# Brand rich emerald green (RGB: 18, 115, 73 -> #127349)
brand_green_rgb = (18, 115, 73)
rgba_green = np.zeros((h, w, 4), dtype=np.uint8)
rgba_green[:, :, 0] = brand_green_rgb[0]
rgba_green[:, :, 1] = brand_green_rgb[1]
rgba_green[:, :, 2] = brand_green_rgb[2]
rgba_green[:, :, 3] = alpha

img_green = Image.fromarray(rgba_green, mode='RGBA')
img_green.save('images/canopy_logo_mark.png')
img_green.save('images/canopy_logo_green.png')

# Vector SVG (Clean, no background box)
contours, hierarchy = cv2.findContours(crop_thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

svg_paths = []
for i, cnt in enumerate(contours):
    area = cv2.contourArea(cnt)
    if area < 100:
        continue
    approx = cv2.approxPolyDP(cnt, 0.5, True)
    pts = approx.reshape(-1, 2)
    path_d = f"M {pts[0][0]} {pts[0][1]} "
    for p in pts[1:]:
        path_d += f"L {p[0]} {p[1]} "
    path_d += "Z"
    svg_paths.append(path_d)

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <g fill="#127349" fill-rule="evenodd">
'''
for d in svg_paths:
    svg_content += f'    <path d="{d}"/>\n'
svg_content += '''  </g>
</svg>'''

with open('images/canopy_logo_mark.svg', 'w') as f:
    f.write(svg_content)

print(f"Generated clean green logo mark successfully! Dimensions: {w}x{h}")
