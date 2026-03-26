from PIL import Image, ImageDraw

SIZE = 128
img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

BG    = (22, 27, 38, 255)
AMBER = (230, 152, 50, 255)
TEAL  = (86, 182, 194, 255)
MUTED = (100, 116, 139, 255)
FAINT = (100, 116, 139, 110)

def rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rectangle([x0+radius, y0, x1-radius, y1], fill=fill)
    draw.rectangle([x0, y0+radius, x1, y1-radius], fill=fill)
    for ex, ey in [(x0,y0),(x1-2*radius,y0),(x0,y1-2*radius),(x1-2*radius,y1-2*radius)]:
        draw.ellipse([ex, ey, ex+2*radius, ey+2*radius], fill=fill)

def chevron(draw, cx, cy, size, color, w):
    h = size // 2
    q = size // 4
    pts = [(cx-q, cy-h), (cx+q, cy), (cx-q, cy+h)]
    for i in range(len(pts)-1):
        draw.line([pts[i], pts[i+1]], fill=color, width=w)

def hline(draw, x0, y, x1, color, w):
    draw.line([(x0,y),(x1,y)], fill=color, width=w)

rounded_rect(draw, [0,0,SIZE-1,SIZE-1], 18, BG)

chevron(draw, 24, 36, 18, AMBER, 5)
hline(draw, 40, 36, 108, AMBER, 4)

chevron(draw, 24, 60, 14, TEAL, 4)
chevron(draw, 38, 60, 14, TEAL, 4)
hline(draw, 52, 60, 104, TEAL, 3)

chevron(draw, 24, 82, 11, MUTED, 3)
chevron(draw, 36, 82, 11, MUTED, 3)
chevron(draw, 48, 82, 11, MUTED, 3)
hline(draw, 60, 82, 98, MUTED, 3)

chevron(draw, 24, 101, 9, FAINT, 2)
chevron(draw, 34, 101, 9, FAINT, 2)
chevron(draw, 44, 101, 9, FAINT, 2)
chevron(draw, 54, 101, 9, FAINT, 2)
hline(draw, 64, 101, 92, FAINT, 2)

img.save(r'C:\Users\Lewis\WebstormProjects\ChevronLists\icon.png', 'PNG')
print('saved')
