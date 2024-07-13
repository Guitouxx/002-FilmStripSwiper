# 002 - Film Stripe Swiper

![Demo Screenshot](https://github.com/Guitouxx/001-WalkingDownTheBrowser/blob/main/static/screenshot.jpg?raw=true)

This repo includes a code extract of the prototype "Walking Down The Browser" [https://playgl.xyz/1](https://playgl.xyz/1).


The idea for this demo came from [@nonfigurativ's tweet](https://x.com/_nonfigurativ_/status/1727322594570027343) about a cross-browser interactivity test.

In this case, we use localstorage to synchronize important information such as the position of the browsers, the position and rotation of the main mesh, and which browser controls the action with its identifier.

All the synchronisation happens in the `src/routes/store.svelte.ts` file.

Don't forget to check the `render` method in the main `route/+page.svelte` file, you will see how it's simple to differentiate which browser can synchronise and which one can update it's status from the storage. 


All prototypes that comes from playgl experiments will be shipped with:
- Threejs  
- Sveltekit  
- Tailwindcss

## How to see the effect

After a `yarn dev`, open the `http://localhost:3000` to see the scene.  
Open a new window with the same URL and move it at another place.  
Click on the stage to move the torus to your cursor and enjoy :)


## Dev


To run:

```sh
# clone repo
git clone https://github.com/Guitouxx/001-WalkingDownTheBrowser.git

# install deps
yarn

# run local host
yarn dev
```

Now open `localhost:3000` to test. Use `yarn run build` to build everything.

## Thanks

Thank you for the help they shared on github, x or shadertoy 

[Bjorn Staal](https://x.com/_nonfigurativ_)


## License

MIT, see [LICENSE](https://github.com/Guitouxx/001-WalkingDownTheBrowser/blob/main/LICENSE) for details.
