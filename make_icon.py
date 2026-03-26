from PIL import Image, ImageDraw

SIZE = 128
img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

BG    = (18, 18, 42, 255)
ROW1  = (168, 85, 247, 255)
ROW2  = (132, 204, 22, 255)
ROW3  = (99, 120, 160, 255)
FAINT = (99, 120, 160, 90)

def rounded_rect(draw, xy, r, fill):
    x0,y0,x1,y1 = xy
    draw.rectangle([x0+r,y0,x1-r,y1], fill=fill)
    draw.rectangle([x0,y0+r,x1,y1-r], fill=fill)
    for ex,ey in [(x0,y0),(x1-2*r,y0),(x0,y1-2*r),(x1-2*r,y1-2*r)]:
        draw.ellipse([ex,ey,ex+2*r,ey+2*r], fill=fill)

def chevron(draw, cx, cy, size, color, w):
    h=size//2; q=size//4
    pts=[(cx-q,cy-h),(cx+q,cy),(cx-q,cy+h)]
    for i in range(len(pts)-1):
        draw.line([pts[i],pts[i+1]], fill=color, width=w)

def hline(draw, x0, y, x1, color, w):
    draw.line([(x0,y),(x1,y)], fill=color, width=w)

rounded_rect(draw, [0,0,SIZE-1,SIZE-1], 18, BG)

chevron(draw, 24, 36, 18, ROW1, 5)
hline(draw,   40, 36, 108, ROW1, 4)

chevron(draw, 24, 60, 14, ROW2, 4)
chevron(draw, 38, 60, 14, ROW2, 4)
hline(draw,   52, 60, 104, ROW2, 3)

chevron(draw, 24, 82, 11, ROW3, 3)
chevron(draw, 36, 82, 11, ROW3, 3)
chevron(draw, 48, 82, 11, ROW3, 3)
hline(draw,   60, 82,  98, ROW3, 3)

chevron(draw, 24, 101, 9, FAINT, 2)
chevron(draw, 34, 101, 9, FAINT, 2)
chevron(draw, 44, 101, 9, FAINT, 2)
chevron(draw, 54, 101, 9, FAINT, 2)
hline(draw,   64, 101,  92, FAINT, 2)

img.save(r'C:\Users\Lewis\WebstormProjects\ChevronLists\icon.png', 'PNG')
print('saved')
