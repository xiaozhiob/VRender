import { IPointLike } from '@visactor/vutils';
import { SegContext } from '../seg-context';
import { ICurveType } from '../../interface';
import { genLinearSegments } from './linear';
import { genBasisSegments } from './basis';
import { genMonotoneXSegments, genMonotoneYSegments } from './monotone';
import { genStepSegments } from './step';
import { genLinearClosedSegments } from './linear-closed';

export * from './linear';
export * from './linear-closed';
export * from './basis';
export * from './monotone';
export * from './step';
export * from './interface';

export function calcLineCache(
  points: IPointLike[],
  curveType: ICurveType,
  params?: { startPoint: IPointLike }
): SegContext | null {
  switch (curveType) {
    case 'linear':
      return genLinearSegments(points, params);
    case 'basis':
      return genBasisSegments(points, params);
    case 'monotoneX':
      return genMonotoneXSegments(points, params);
    case 'monotoneY':
      return genMonotoneYSegments(points, params);
    case 'step':
      return genStepSegments(points, 0.5, params);
    case 'stepBefore':
      return genStepSegments(points, 0, params);
    case 'stepAfter':
      return genStepSegments(points, 1, params);
    case 'linearClosed':
      return genLinearClosedSegments(points, params);
    default:
      return genLinearSegments(points, params);
  }
}
