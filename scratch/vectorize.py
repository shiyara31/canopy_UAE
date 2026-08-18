import cv2
import numpy as np

# Load transparent cropped image
img = cv2.imread(r'c:\Users\acer\OneDrive\Documents\canopy UAE\images\canopy_logo_brand_blue_cropped_transparent.png', cv2.IMREAD_UNCHANGED)
alpha = img[:, :, 3]
h, w = alpha.shape

# Threshold to find paths
_, thresh = cv2.threshold(alpha, 127, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

svg_paths = []
for i, cnt in enumerate(contours):
    if cv2.contourArea(cnt) < 5:
        continue
    epsilon = 0.001 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    d = 'M ' + ' L '.join(f'{pt[0][0]} {pt[0][1]}' for pt in approx) + ' Z'
    svg_paths.append(d)

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <g fill="#1B6CD8" fill-rule="evenodd">
'''
for p in svg_paths:
    svg_content += f'    <path d="{p}"/>\n'
svg_content += '''  </g>
</svg>'''

with open(r'c:\Users\acer\OneDrive\Documents\canopy UAE\images\canopy_logo_full_blue.svg', 'w') as f:
    f.write(svg_content)
with open(r'C:\Users\acer\.gemini\antigravity-ide\brain\517ae489-c7ec-4533-b653-9c89fb6ba4e8\canopy_logo_full_blue.svg', 'w') as f:
    f.write(svg_content)

print(f'Generated canopy_logo_full_blue.svg with {len(svg_paths)} paths')
