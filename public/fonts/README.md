# SF Pro Font Files

To use the SF Pro Display font, you need to extract the font files from the SF-Pro.dmg and convert them to web fonts.

## Steps:

1. Mount the SF-Pro.dmg file
2. Extract the SF Pro Display font files (.otf or .ttf)
3. Convert them to .woff2 format using a tool like:
   - https://cloudconvert.com/ttf-to-woff2
   - Or use `fonttools` command line tool

4. Place the converted .woff2 files in this directory with these names:
   - SF-Pro-Display-Ultralight.woff2
   - SF-Pro-Display-Thin.woff2
   - SF-Pro-Display-Light.woff2
   - SF-Pro-Display-Regular.woff2
   - SF-Pro-Display-Medium.woff2
   - SF-Pro-Display-Semibold.woff2
   - SF-Pro-Display-Bold.woff2

## Alternative:

If you can't extract the fonts, the site will fallback to system fonts which look very similar on Apple devices.

The CSS is already configured in `app/fonts/sf-pro.css` and imported in `app/globals.css`.

