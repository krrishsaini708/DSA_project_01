# DSA Visualizer

A simple web app that shows how common Data Structures and Algorithms work, one step at a time. Pick an algorithm, press **Start**, and watch it run.

Made by **Krrish Saini**.

Inspired by [Algorithms Visualizer](https://tpspace.github.io/Algorithms-Visualizer/).

## Algorithms

| Type | Algorithms |
|------|------------|
| Sorting | Bubble Sort, Selection Sort, Insertion Sort, Quick Sort |
| Searching | Linear Search, Binary Search |
| Graph traversal | Breadth-First Search (BFS), Depth-First Search (DFS) |

## Features

- Start, Pause, Resume, Step and Reset buttons
- Speed slider and array size slider
- Choose your own start point, end point and walls on the BFS/DFS grid
- Color legend that explains what each color means
- Time and space complexity shown for every algorithm
- Light and dark mode, works on phones and laptops

## Technologies used

| Technology | Used for |
|------------|----------|
| HTML | Page structure |
| CSS | Layout, colors and styling |
| JavaScript | Algorithms and animation |

No frameworks, libraries or build tools are used.

## Project structure

```
dsa-visualizer/
  index.html   the page
  style.css    the styling
  script.js    the algorithms and animation
  README.md    this file
```

## How it was made

1. **Page layout (HTML):** a sidebar lists the algorithms, and the main area holds the controls, the drawing area and the explanation text.
2. **Styling (CSS):** a card layout with a color for each state: yellow for comparing, red for swapping, green for sorted or found.
3. **Algorithms (JavaScript):** each algorithm is written as a generator function. It pauses (`yield`) after every step, so the page can draw that step and wait before running the next one. This is what makes Pause and Step work.
4. **Drawing:** after every step, the page redraws the bars (for sorting and searching) or the grid cells (for BFS and DFS).
5. **Controls:** the buttons start or stop a timer that runs the next step. The speed slider changes the delay between steps.

## How to run

1. Download or clone this repository.
2. Open `index.html` in any web browser.

No installation is needed.

## How to add a new algorithm

1. Write a generator function in `script.js` that updates the shared state and calls `yield` after each visible step.
2. Add an entry for it in the `ALGOS` object and in the `GROUPS` list.

## Author

Krrish Saini
