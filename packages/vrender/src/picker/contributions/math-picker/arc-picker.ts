import { inject, injectable } from 'inversify';
import { IPoint } from '@visactor/vutils';
import { ARC_NUMBER_TYPE, getTheme } from '../../../graphic';
import { IArc, IGraphicAttribute, IContext2d, IMarkAttribute, IThemeAttribute } from '../../../interface';
import { IGraphicPicker, IPickParams } from '../../picker-service';
import { ArcRender, IGraphicRender } from '../../../render';
import { graphicService } from '../../../modules';

@injectable()
export class DefaultMathArcPicker implements IGraphicPicker {
  type: string = 'arc';
  numberType: number = ARC_NUMBER_TYPE;

  constructor(@inject(ArcRender) public readonly canvasRenderer: IGraphicRender) {}

  contains(arc: IArc, point: IPoint, params?: IPickParams): boolean {
    if (!arc.AABBBounds.containsPoint(point)) {
      return false;
    }
    if (arc.attribute.pickMode === 'imprecise') {
      return true;
    }

    const { pickContext } = params ?? {};
    if (!pickContext) {
      return false;
    }

    // const arcAttribute = graphicService.themeService.getCurrentTheme().arcAttribute;
    const arcAttribute = getTheme(arc).arc;
    pickContext.highPerformanceSave();
    let { x = arcAttribute.x, y = arcAttribute.y } = arc.attribute;
    if (!arc.transMatrix.onlyTranslate()) {
      // 性能较差
      x = 0;
      y = 0;
      pickContext.transformFromMatrix(arc.transMatrix, true);
    } else {
      const point = arc.getOffsetXY(arcAttribute);
      x += point.x;
      y += point.y;
      // 当前context有rotate/scale，重置matrix
      pickContext.setTransformForCurrent();
    }

    // 详细形状判断
    let picked = false;
    this.canvasRenderer.drawShape(
      arc,
      pickContext,
      x,
      y,
      {} as any,
      null,
      (
        context: IContext2d,
        arcAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
        themeAttribute: IThemeAttribute
      ) => {
        // 选中后面就不需要再走逻辑了
        if (picked) {
          return true;
        }
        picked = context.isPointInPath(point.x, point.y);
        return picked;
      },
      (
        context: IContext2d,
        arcAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
        themeAttribute: IThemeAttribute
      ) => {
        // 选中后面就不需要再走逻辑了
        if (picked) {
          return true;
        }
        const lineWidth = arcAttribute.lineWidth || themeAttribute.lineWidth;
        pickContext.lineWidth = lineWidth;
        picked = context.isPointInStroke(point.x, point.y);
        return picked;
      }
    );

    pickContext.highPerformanceRestore();
    return picked;
  }
}
