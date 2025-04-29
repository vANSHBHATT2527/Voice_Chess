import os
import requests
from PIL import Image
import io

def download_piece(color, piece):
    # Using a different source for chess pieces
    url = f"https://github.com/lichess-org/lila/tree/master/public/piece/cburnett/{color}{piece}.svg"
    response = requests.get(url)
    if response.status_code == 200:
        # Save the SVG file directly
        with open(f"pieces/{color}_{piece}.svg", "wb") as f:
            f.write(response.content)
        print(f"Downloaded {color}_{piece}.svg")
    else:
        print(f"Failed to download {color}_{piece}.svg")

def main():
    if not os.path.exists("pieces"):
        os.makedirs("pieces")
    
    pieces = ['P', 'N', 'B', 'R', 'Q', 'K']
    colors = ['w', 'b']  # Using 'w' and 'b' as per lichess convention
    
    for color in colors:
        for piece in pieces:
            download_piece(color, piece)

if __name__ == "__main__":
    main() 