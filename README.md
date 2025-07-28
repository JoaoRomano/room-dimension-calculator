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

## Usage

1. **Load Room**: Application automatically loads a random room on startup
2. **View Dimensions**: Current length and width dimensions are displayed
3. **Cycle Walls**: Click "Next Wall Reference" to see different dimension options
4. **Visual Feedback**: Canvas updates in real-time with new calculations

## Technical Implementation

### Geometric Algorithm

The application uses right triangle trigonometry:

- **Width Calculation**: Creates two right triangles per corner to find maximum room extent parallel to selected wall
- **Length Calculation**: Creates one right triangle per corner using perpendicular direction to find full room span

### Key Components

- **TriangleCalculator**: Handles all geometric calculations
- **CanvasRenderer**: Manages canvas drawing and coordinate transformations
- **RoomCanvas**: Vue component for interactive visualization

## Future Improvements

For potential enhancements and performance optimizations, see [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md).

## License

This project is created for educational and demonstration purposes.
