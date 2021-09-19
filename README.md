# Candy Generator

Welcome to the Candy Generator! This is a tool that will allow you to create
and save your own repository candy, to truly celebrate an Open Source Halloween! 

🚧️ **under development** 🚧️

## Frequently Asked Questions

### How does it work?

Overall, the idea is that we are putting together puzzle pieces. We have candy form bases (e.g., an outline of a candy bar)
that we can add to an svg, and then further customize by adding text, textures, and color. 

### How did I make the candy backgrounds?

This was a manual process! I started with a png of a candy that I wanted to use, and then:

1. In Inkscape used trace bitmap with 8 colors to get to a bottom, solid layer
2. Added an extra layer of the same color (usually a large rectangle) and combined with the lower to fill in gaps.
3. Saved to an svg file, stored in [assets/candy](assets/candy)
4. Copied the paths, style, and other attributes into the [assets/js/candy.json](assets/js/candy.json)

Getting the text to line up was a big of an art! I tested each background to make a custom scale
and then x and y offset for the main text.

## Thanks

The Candy Generator would not be possible without these amazing supporting libraries!

- [textures](https://riccardoscalco.it/textures/): to make your candy wrapper textures!
- [d3](https://d3js.org/): for easily mapping data to svg objects
- [jquery](https://jquery.com/): because you can make a million new trendy JS libraries but this one always is easy-peezy
