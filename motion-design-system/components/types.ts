export type AnimationPreset =
  | 'fadeIn'
  | 'slideIn'
  | 'popIn'
  | 'scaleUp'
  | 'float'
  | 'bounce'
  | 'drawOn'
  | 'morph'
  | 'stagger'
  | 'cameraPush'
  | 'cameraPull';

export type CharacterPoseName =
  | 'front'
  | 'profile'
  | 'seated'
  | 'walking'
  | 'pointing'
  | 'holdingObject';

export type Orientation = 'left' | 'right';

export interface BaseMotionProps {
  x?: number;
  y?: number;
  scale?: number;
  startFrame?: number;
  animation?: AnimationPreset;
  color?: string;
}

export interface CharacterProps extends BaseMotionProps {
  pose?: CharacterPoseName;
  expression?: 'neutral' | 'happy' | 'focused' | 'curious';
  orientation?: Orientation;
}
