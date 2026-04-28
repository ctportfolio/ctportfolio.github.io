# Cole Timlin Portfolio Starter

React + Vite starter for a surreal retro-VM portfolio.

## Included
- boot/login screen
- 3D abandoned-room background with subtle CRT/VHS overlay
- infinite-feel 3-card category carousel
- draggable VM windows
- taskbar with socials
- photography grid shell
- custom editing/video player shell
- placeholders for all requested categories

## Run
```bash
npm install
npm run dev
```

## Important easy-edit files
- `src/data/siteConfig.js`
- `src/data/categories.js`
- `src/styles/global.css`

## Change first focused category
Edit:
```js
firstFocusedCategoryId: 'photography'
```
inside `src/data/siteConfig.js`

## Replace placeholders
Right now, the surreal objects are symbolic text/shape placeholders.
Next step is replacing them with your own transparent PNGs or 3D assets.