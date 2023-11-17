import os
from PIL import Image, ImageDraw

# List all filenames in the current folder
files = os.listdir()

# Don't use these files
files.remove('atlas.py')
files.remove('atlas.png')

# Sort the files alphabetically by their name
files.sort()

# Create a new image that will be the atlas
atlas = Image.new('RGBA', (320, 320))

# All the sprite positions will be stored in here
positions = {}

# Some coordinate variables
x = 0
y = 0
for file in files:
    with Image.open(file) as im:
        # Paste the source image onto the atlas
        atlas.paste(im, box=(x, y))
    
    # Don't include the filetype when
    positions[file.replace('.png','')] = [x, y]
    
    # Move to the next spot
    x += 32
    # Go to next row if hit end
    if (x == 320):
        y += 32
        x = 0

print(positions)

atlas.save('atlas.png')