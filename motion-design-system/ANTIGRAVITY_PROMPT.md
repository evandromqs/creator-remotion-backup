# TASK: Create a Modern Explainer Motion Design System

## OBJECTIVE
Create a reusable visual identity and component library for producing professional animated videos using Remotion, React, TypeScript and SVG.

The visual direction is MODERN EXPLAINER.

The system must support tutorials, educational videos, storytelling, curiosities, presentations and advertisements.

## 1. VISUAL DIRECTION

Follow these principles:

- Modern 2D flat vector illustrations.
- Simple geometric characters.
- Rounded geometric shapes.
- Consistent proportions and visual weight.
- Limited color palettes.
- Minimalist environments.
- Soft shadows and subtle depth.
- Clear visual hierarchy.
- Professional editorial composition.
- Smooth and intentional motion.

Avoid:
- Childish cartoon aesthetics.
- Generic corporate presentation templates.
- Excessive gradients.
- Heavy shadows.
- Unnecessary visual details.
- Inconsistent illustration styles.
- Random decorative elements.

## 2. REFERENCE INTELLIGENCE

Before implementation:

1. Read all files inside references/.
2. Analyze every reference image.
3. Identify recurring visual characteristics.
4. Extract color, shape, composition, character and shadow rules.
5. Read REFERENCE_INDEX.md.
6. Use references as visual guidance, not as assets to reproduce identically.

If references are missing, report what is missing instead of inventing a visual direction.

## 3. DESIGN SYSTEM

Create:

- Color tokens.
- Typography system.
- Spacing scale.
- Corner radius standards.
- Shadow presets.
- Character proportions.
- Object construction rules.
- Background styles.
- Scene composition rules.

## 4. REUSABLE COMPONENTS

Create modular React components:

- Character
- CharacterPose
- Scene
- Background
- GeometricShape
- AnimatedObject
- AnimatedText
- Callout
- Shadow
- MotionTransition
- Infographic

Components must accept configurable properties.

## 5. ANIMATION ENGINE

Use Remotion APIs:

- useCurrentFrame()
- useVideoConfig()
- interpolate()
- spring()
- Easing

Create reusable animation presets:

- Fade In
- Slide In
- Pop In
- Scale Up
- Float
- Bounce
- Draw On
- Morph
- Stagger
- Camera Push
- Camera Pull

Animations must be deterministic and frame-based.

Do not use CSS transitions or CSS keyframe animations as the video animation engine.

## 6. DEMONSTRATION

Create a demonstration project containing:

1. Character introduction.
2. Character interacting with objects.
3. Animated geometric transitions.
4. A complete illustrated environment.
5. An animated infographic.
6. A final composition with typography.

Create both 16:9 and 9:16 compositions.

## 7. QUALITY CONTROL

Check:

- Visual consistency.
- Correct proportions.
- Color consistency.
- Animation timing.
- No unexpected clipping.
- No overlapping elements.
- Render compatibility.
- Component reusability.

## 8. DOCUMENTATION

Generate:

- MOTION_DESIGN_SYSTEM.md
- ANIMATION_RULES.md
- COMPONENT_LIBRARY.md
- REFERENCE_INDEX.md
- USAGE_EXAMPLES.md

## IMPORTANT

Do not start producing unrelated videos.

First establish the visual system, implement the reusable components, create a demonstration and render it for visual inspection.

The result must be a reusable production foundation, not a one-off animation.
