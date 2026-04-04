import urllib.request
import os

logos_dir = '/Users/defuel/Antigravity/100x-dashboard/landing-page/public/assets/logos'
os.makedirs(logos_dir, exist_ok=True)

targets = [
  ('openai', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png'),
  ('google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png'),
  ('microsoft', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png'),
  ('tesla', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1024px-Tesla_Motors.svg.png'),
  ('nvidia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1024px-Nvidia_logo.svg.png'),
  ('apple', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1024px-Apple_logo_black.svg.png'),
  ('meta', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1024px-Meta_Platforms_Inc._logo.svg.png')
]

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0')]
urllib.request.install_opener(opener)

for name, url in targets:
    try:
        dest = os.path.join(logos_dir, name + '.png')
        urllib.request.urlretrieve(url, dest)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")
