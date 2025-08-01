# Room Dimension Calculator

A Vue 3 + TypeScript application that calculates and visualizes room dimensions using geometric algorithms. The application handles various room shapes (triangle, rectangle, T-shape) and calculates width and length dimensions based on right triangle trigonometry.

## Exercise Description

This project implements a room dimension calculator that:

1. **Loads random room shapes** from JSON data (triangle, rectangle, T-shape)
2. **Calculates dimensions** using right triangle trigonometry:
   - **Width**: Parallel to selected wall, spanning maximum room extent
   - **Length**: Perpendicular to selected wall, spanning full room extent
3. **Visualizes results** on HTML5 Canvas with interactive wall cycling
4. **Provides real-time feedback** with dimension measurements and room information

## Features

- **Multiple Room Shapes**: Triangle, Rectangle, T-shape support
- **Geometric Calculations**: Right triangle algorithm for accurate dimensions
- **Interactive Visualization**: Canvas rendering with dimension axes
- **Wall Cycling**: Cycle through different wall references
- **Real-time Updates**: Instant dimension recalculation and display

## Project Structure

```
src/
├── components/
│   ├── RoomViewer.vue          # Main application component
│   └── RoomCanvas.vue          # Canvas visualization component
├── types/
│   ├── room.ts                 # Room data interfaces
│   └── geometry.ts             # Geometric type definitions
├── renderers/
│   ├── canvasRenderer.ts       # Canvas rendering engine
├── utils/
│   ├── triangleCalculator.ts   # Core geometric calculations
│   ├── geometry.ts             # Vector and geometric utilities
│   ├── dimensions.ts           # Dimension calculation orchestration
│   └── roomLoader.ts           # Room data loading utilities
└── assets/
    └── json_assets/            # Room data files
        ├── simple.json         # Trapezoid room data
        ├── triangle.json       # Triangle room data
        └── t_shape.json        # T-shaped room data
```

## Usage

1. **Load Room**: Application automatically loads a random room on startup
2. **View Dimensions**: Current length and width dimensions are displayed
3. **Cycle Walls**: Click "Next Wall Reference" to see different dimension options
4. **Visual Feedback**: Canvas updates in real-time with new calculations

## Technical Implementation

### Geometric Algorithm

The application uses right triangle trigonometry to calculate room dimensions based on wall references:

#### Width Calculation

The width calculation determines the maximum room extent parallel to the selected wall reference. The algorithm creates right triangles to find the optimal width measurement:

![Width Calculation Diagram](./docs/width_calculation.png)

**Process:**

1. **Identify Wall Points**: Locate the two wall points that define the reference wall (bottom-left and bottom-right red points)
2. **Create Right Triangles**: For each corner point, create a right triangle (blue lines) with:
   - One leg parallel to the reference wall
   - One leg perpendicular to the reference wall
   - Hypotenuse connecting the corner to the wall point
3. **Calculate Maximum Width**: The width is the maximum horizontal distance between any two points parallel to the reference wall
4. **Compare Measurements**: The algorithm compares `currentWidth` (green line) with `newWidth` (blue line) to determine the optimal width measurement

#### Length Calculation

The length calculation determines the full room span perpendicular to the selected wall reference:

![Length Calculation Diagram](./docs/length_calculation.png)

**Process:**

1. **Establish Reference Point**: Use a `thirdPoint` (bottom-left red point) as the reference for perpendicular measurements
2. **Create Right Triangle**: Form a right triangle with:
   - One leg from `thirdPoint` to `wallPoint` (blue horizontal line labeled "currentLength (0)")
   - One leg from `thirdPoint` to `cornerPoint` (blue vertical line labeled "newLength")
   - Right angle at `thirdPoint` (blue square symbol)
3. **Calculate Perpendicular Distance**: The length is the maximum perpendicular distance from the reference wall
4. **Handle Edge Cases**: When `currentLength` is 0 (as shown in the diagram), the algorithm uses the `newLength` calculation for the final length measurement

### Key Components

- **TriangleCalculator**: Handles all geometric calculations
- **CanvasRenderer**: Manages canvas drawing and coordinate transformations
- **RoomCanvas**: Vue component for interactive visualization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

This application is configured for automatic deployment to GitHub Pages via GitHub Actions.

[Link to Deployed App](https://joaoromano.github.io/room-dimension-calculator/)

### Automatic Deployment

The application automatically deploys when you push to the `main` branch. The deployment process:

1. **Builds** the Vue.js application
2. **Runs** type checking and linting
3. **Deploys** to GitHub Pages

## Future Improvements

For potential enhancements and performance optimizations, see [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md).

## License

This project is created for educational and demonstration purposes.
