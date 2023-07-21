import { PointScale, LinearScale } from '@visactor/vscale';
import type { IGraphic, Stage, Group, ILine, Text } from '@visactor/vrender';
import type { Grid } from '../../../src';
import { LineAxis, Segment } from '../../../src';
import { createCanvas } from '../../util/dom';
import { createStage } from '../../util/vrender';
import { AXIS_ELEMENT_NAME } from '../../../src/axis/constant';
import { Tag } from './../../../src/tag/tag';

describe('Line Axis', () => {
  let stage: Stage;
  beforeAll(() => {
    createCanvas(document.body, 'main');
    stage = createStage('main');
  });

  afterAll(() => {
    stage.release();
  });

  it('horizontal direction.', () => {
    const domain = 'ABCDEFGH'.split('');
    const scale = new PointScale().domain(domain).range([0, 1]);
    const items = domain.map(value => {
      return {
        id: value,
        label: value,
        value: scale.scale(value),
        rawValue: value
      };
    });
    const axis = new LineAxis({
      start: { x: 100, y: 100 },
      end: { x: 500, y: 100 },
      items: [items],
      line: {
        startSymbol: {
          visible: true
        },
        endSymbol: {
          visible: true
        }
      },
      tick: {
        visible: true,
        length: 20,
        style: (datum, index) => {
          if (index === 0) {
            return {
              stroke: 'red',
              lineWidth: 2
            };
          }
        }
      },
      subTick: {
        visible: true,
        count: 3,
        length: 8,
        style: (datum, index) => {
          if (index === 3) {
            return {
              stroke: 'red',
              lineWidth: 2
            };
          }
        }
      },
      label: {
        visible: true,
        formatMethod: (text, datum, index) => {
          if (index === 0) {
            return `${text}---`;
          }
          return text;
        },
        style: (value, index) => {
          if (index === 0) {
            return {
              fill: 'red'
            };
          }
        }
      }
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();
    const lineShape = axis.getElementsByName(AXIS_ELEMENT_NAME.line)[0] as unknown as Segment;
    expect(lineShape).toBeInstanceOf(Segment);
    expect(lineShape.childrenCount).toBe(3);

    const tickLineGroup = axis.getElementsByName(AXIS_ELEMENT_NAME.tickContainer)[0] as unknown as Group;

    expect(tickLineGroup.childrenCount).toBe(29);
    const tickLine = tickLineGroup.children.filter(child => child.name === AXIS_ELEMENT_NAME.tick);
    expect(tickLine.length).toBe(8);
    expect((tickLine[0] as unknown as ILine).attribute.stroke).toBe('red');
    expect((tickLine[0] as unknown as ILine).attribute.points).toEqual([
      { x: 100, y: 100 },
      { x: 100, y: 120 }
    ]);

    const subTickLine = tickLineGroup.children.filter(child => child.name === AXIS_ELEMENT_NAME.subTick);
    expect(subTickLine.length).toBe(21);
    expect((subTickLine[0] as unknown as ILine).attribute.stroke).toBe('#999');
    expect((subTickLine[0] as unknown as ILine).attribute.points).toEqual([
      { x: 114.28571428571428, y: 100 },
      { x: 114.28571428571428, y: 108 }
    ]);

    const axisLabels = axis.getElementsByName(`${AXIS_ELEMENT_NAME.labelContainer}-layer-0`)[0] as unknown as Group;
    expect(axisLabels.childrenCount).toBe(8);
    expect((axisLabels.children[0] as unknown as Text).attribute.x).toBe(100);
    expect((axisLabels.children[0] as unknown as Text).attribute.y).toBe(124);
    expect((axisLabels.children[0] as unknown as Text).attribute.textAlign).toBe('center');
    expect((axisLabels.children[0] as unknown as Text).attribute.textBaseline).toBe('top');
    expect((axisLabels.children[0] as unknown as Text).attribute.text).toBe('A---');
    expect((axisLabels.children[0] as unknown as Text).AABBBounds.width()).toBeCloseTo(29.663970947265625);
  });

  it('vertical direction.', () => {
    const domain = 'ABCDEFGH'.split('');
    const scale = new PointScale().domain(domain).range([0, 1]);
    const items = domain.map(value => {
      return {
        id: value,
        label: value,
        value: scale.scale(value),
        rawValue: value
      };
    });
    const axis = new LineAxis({
      start: { x: 100, y: 200 },
      end: { x: 100, y: 450 },
      items: [items],
      line: {
        startSymbol: {
          visible: true
        },
        endSymbol: {
          visible: true
        }
      },
      tick: {
        visible: true,
        length: 20,
        style: {
          stroke: 'red'
        }
      },
      subTick: {
        visible: true,
        count: 3,
        length: 8,
        style: {
          stroke: 'blue'
        }
      },
      label: {
        visible: true,
        formatMethod: (text, datum, index) => {
          if (index === 0) {
            return `${text}---`;
          }
          return text;
        }
      }
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();

    const tickLineGroup = axis.getElementsByName(AXIS_ELEMENT_NAME.tickContainer)[0] as unknown as Group;
    expect(tickLineGroup.childrenCount).toBe(29);
    const tickLine = tickLineGroup.children.filter(child => child.name === AXIS_ELEMENT_NAME.tick);
    expect((tickLine[0] as unknown as ILine).attribute.points).toEqual([
      { x: 100, y: 200 },
      { x: 80, y: 200 }
    ]);

    const subTickLine = tickLineGroup.children.filter(child => child.name === AXIS_ELEMENT_NAME.subTick);
    expect((subTickLine[0] as unknown as ILine).attribute.points).toEqual([
      { x: 100, y: 208.92857142857142 },
      { x: 92, y: 208.92857142857142 }
    ]);

    const axisLabels = axis.getElementsByName(`${AXIS_ELEMENT_NAME.labelContainer}-layer-0`)[0] as unknown as Group;
    expect(axisLabels.childrenCount).toBe(8);
    expect((axisLabels.children[0] as unknown as Text).attribute.x).toBe(76);
    expect((axisLabels.children[0] as unknown as Text).attribute.y).toBe(200);
    expect((axisLabels.children[0] as unknown as Text).attribute.text).toBe('A---');
    expect((axisLabels.children[0] as unknown as Text).attribute.textAlign).toBe('end');
    expect((axisLabels.children[0] as unknown as Text).attribute.textBaseline).toBe('middle');
    expect((axisLabels.children[0] as unknown as Text).AABBBounds.width()).toBeCloseTo(29.663970947265625);
  });

  it('Line Axis with Title', () => {
    const scale = new LinearScale().domain([0, 100]).range([0, 1]).nice();
    const items = scale.ticks(10).map(tick => {
      return {
        id: tick,
        label: tick,
        value: scale.scale(tick),
        rawValue: tick
      };
    });
    const axis = new LineAxis({
      start: { x: 100, y: 250 },
      end: { x: 400, y: 500 },
      items: [items],
      title: {
        visible: true,
        text: 'Title'
      },
      label: {
        visible: true
      }
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();

    let axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle).toBeInstanceOf(Tag);
    expect(axisTitle.attribute.x).toBeCloseTo(230.01857069132552);
    expect(axisTitle.attribute.y).toBeCloseTo(398.9777151704094);
    expect(axisTitle.attribute.angle).toBeCloseTo(0.6947382761967031);

    // 将 title 位置更新至 start
    axis.setAttribute('title', { position: 'start' });
    axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.x).toBeCloseTo(80.01857069132552);
    expect(axisTitle.attribute.y).toBeCloseTo(273.9777151704094);
    expect(axisTitle.attribute.angle).toBeCloseTo(0.6947382761967031);

    // 将 title 位置更新至 end
    axis.setAttribute('title', { position: 'end' });
    axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.x).toBeCloseTo(380.0185706913255);
    expect(axisTitle.attribute.y).toBeCloseTo(523.9777151704094);
    expect(axisTitle.attribute.angle).toBeCloseTo(0.6947382761967031);

    // title 不跟随旋转
    axis.setAttribute('title', { autoRotate: false });
    axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.angle).toBe(undefined);

    // title 设置背景、超长省略
    axis.setAttribute('title', {
      autoRotate: true,
      panel: {
        visible: true,
        fill: 'rgba(0, 0, 0, 0.3)'
      },
      padding: 4,
      maxWidth: 60,
      text: '我是一个坐标轴标题'
    });
    axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.x).toBeCloseTo(380.0185706913255);
    expect(axisTitle.attribute.y).toBeCloseTo(523.9777151704094);
    expect(axisTitle.attribute.angle).toBeCloseTo(0.6947382761967031);
    expect(axisTitle.getElementsByName('tag-panel')).toBeDefined();
  });

  it('Line Axis with Gird, and tick.alignWithLabel set false', () => {
    const scale = new LinearScale().domain([0, 100]).range([0, 1]).nice();
    const items = scale.ticks(10).map(tick => {
      return {
        id: tick,
        label: tick,
        value: scale.scale(tick),
        rawValue: tick
      };
    });
    const axis = new LineAxis({
      start: { x: 100, y: 150 },
      end: { x: 200, y: 350 },
      items: [items],
      label: {
        visible: true
      },
      tick: {
        visible: true,
        alignWithLabel: false
      },
      grid: {
        visible: true,
        type: 'line',
        length: 150,
        alternateColor: '#ccc',
        style: (datum, index) => {
          if (index === 1) {
            return {
              stroke: 'red',
              lineWidth: 3,
              lineDash: [4, 4]
            };
          }
          return {
            lineDash: [4, 4]
          };
        }
      },
      subGrid: {
        visible: true,
        style: {
          stroke: 'red'
        }
      }
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();

    const axisLabels = axis.getElementsByName(`${AXIS_ELEMENT_NAME.labelContainer}-layer-0`)[0] as unknown as Group;
    expect(axisLabels.childrenCount).toBe(11);

    // 验证 tick 是否渲染正确
    const tickLineGroup = axis.getElementsByName(AXIS_ELEMENT_NAME.tickContainer)[0] as unknown as Group;
    expect(tickLineGroup.childrenCount).toBe(10);
    const tickLine = tickLineGroup.children.filter(child => child.name === AXIS_ELEMENT_NAME.tick);
    expect(tickLine.length).toBe(10);
    // @ts-ignore
    expect(tickLine[0].attribute.points[0]).toEqual({
      // @ts-ignore
      x: (axis.data[0].point.x + axis.data[1].point.x) / 2,
      // @ts-ignore
      y: (axis.data[0].point.y + axis.data[1].point.y) / 2
    });

    // 验证 grid 是否渲染正确
    let gridLineGroup = axis.getElementsByName('axis-grid')[0] as unknown as Grid;
    expect(gridLineGroup).toBeDefined();
    expect(gridLineGroup.attribute.items?.length).toBe(11);
    // @ts-ignore
    expect(gridLineGroup.attribute.items[0]).toEqual({
      id: 0,
      points: [
        { x: 100, y: 150 },
        { x: 234.1640786499874, y: 82.9179606750063 }
      ],
      datum: {
        id: 0,
        label: 0,
        point: {
          x: 100,
          y: 150
        },
        rawValue: 0,
        value: 0
      }
    });

    // 验证 subGrid 是否渲染正确
    let subGridLineGroup = axis.getElementsByName('axis-grid-sub')[0] as unknown as Grid;
    expect(subGridLineGroup).toBeDefined();
    expect(subGridLineGroup.attribute.items?.length).toBe(51);
    // @ts-ignore
    expect(subGridLineGroup.attribute.items[0]).toEqual({
      id: 'sub-0-0',
      points: [
        { x: 100, y: 150 },
        { x: 234.1640786499874, y: 82.9179606750063 }
      ],
      datum: {}
    });

    // polygon 类型 grid
    axis.setAttributes({
      start: { x: 250, y: 350 },
      end: { x: 450, y: 350 },
      tick: {
        visible: true,
        alignWithLabel: true
      },
      grid: {
        visible: true,
        type: 'polygon',
        center: { x: 250, y: 350 },
        closed: true,
        sides: 3,
        startAngle: 0,
        endAngle: Math.PI * 2
      }
    });

    gridLineGroup = axis.getElementsByName('axis-grid')[0] as unknown as Grid;
    // @ts-ignore
    expect(gridLineGroup.attribute.items[0]).toEqual({
      id: 0,
      points: [
        { x: 250, y: 350 },
        { x: 250, y: 350 },
        { x: 250, y: 350 }
      ],
      datum: {
        id: 0,
        label: 0,
        point: {
          x: 250,
          y: 350
        },
        rawValue: 0,
        value: 0
      }
    });
    // @ts-ignore
    expect(gridLineGroup.attribute.items[1]).toEqual({
      id: 10,
      points: [
        { x: 270, y: 350 },
        { x: 240, y: 367.3205080756888 },
        { x: 240, y: 332.6794919243112 }
      ],
      datum: {
        id: 10,
        label: 10,
        point: {
          x: 270,
          y: 350
        },
        rawValue: 10,
        value: 0.1
      }
    });
    subGridLineGroup = axis.getElementsByName('axis-grid-sub')[0] as unknown as Grid;
    expect(subGridLineGroup.attribute.items?.length).toBe(51);
    // @ts-ignore
    expect(subGridLineGroup.attribute.items[0]).toEqual({
      id: 'sub-0-0',
      points: [
        { x: 250, y: 350 },
        { x: 250, y: 350 },
        { x: 250, y: 350 }
      ],
      datum: {}
    });

    // circle 类型 grid
    axis.setAttributes({
      grid: {
        visible: true,
        type: 'circle',
        center: { x: 240, y: 350 },
        alternateColor: undefined,
        sides: 2
      }
    });

    gridLineGroup = axis.getElementsByName('axis-grid')[0] as unknown as Grid;
    // @ts-ignore
    expect(gridLineGroup.attribute.items[0]).toEqual({
      id: 0,
      points: [
        { x: 250, y: 350 },
        { x: 230, y: 350 }
      ],
      datum: {
        id: 0,
        label: 0,
        point: {
          x: 250,
          y: 350
        },
        rawValue: 0,
        value: 0
      }
    });
    // @ts-ignore
    expect(gridLineGroup.attribute.items[1]).toEqual({
      id: 10,
      points: [
        { x: 270, y: 350 },
        { x: 210, y: 350 }
      ],
      datum: {
        id: 10,
        label: 10,
        point: {
          x: 270,
          y: 350
        },
        rawValue: 10,
        value: 0.1
      }
    });

    subGridLineGroup = axis.getElementsByName('axis-grid-sub')[0] as unknown as Grid;
    expect(subGridLineGroup.attribute.items?.length).toBe(51);
    // @ts-ignore
    expect(subGridLineGroup.attribute.items[0]).toEqual({
      id: 'sub-0-0',
      points: [
        { x: 250, y: 350 },
        { x: 230, y: 350 }
      ],
      datum: {}
    });
  });

  it('Vertical Line Axis with Title', () => {
    const axis = new LineAxis({
      title: {
        space: 20,
        padding: 0,
        textStyle: {
          fontSize: 11,
          fill: 'rgb(169,174,184)',
          fontWeight: 'normal',
          fillOpacity: 1,
          textAlign: 'left',
          textBaseline: 'bottom',
          angle: 3.141592653589793,
          text: 'DAU'
        },
        visible: true,
        autoRotate: false,
        shape: {},
        background: {},
        text: 'y'
      },
      label: {
        visible: true,
        inside: false,
        space: 20,
        style: {
          fontSize: 14,
          fill: '#89909D',
          fontWeight: 'normal',
          fillOpacity: 1,
          textAlign: 'left'
        },
        autoRotate: false,
        autoHide: false,
        autoLimit: false
      },
      tick: {
        visible: false,
        inside: false,
        alignWithLabel: true,
        length: 4,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      subTick: {
        visible: false,
        inside: false,
        count: 4,
        length: 2,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      line: {
        visible: false,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      grid: {
        style: {
          lineWidth: 1,
          stroke: '#EBEDF2',
          strokeOpacity: 1,
          lineDash: [2, 2]
        },
        visible: true,
        length: 337,
        type: 'line',
        depth: 0
      },
      subGrid: {
        visible: false,
        style: {
          lineWidth: 1,
          stroke: '#EBEDF2',
          strokeOpacity: 1,
          lineDash: [4, 4]
        }
      },
      x: 151,
      y: 12,
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 102.25
      },
      items: [
        [
          {
            id: '0',
            label: '0',
            value: 0.9149881024361075,
            rawValue: 0
          },
          {
            id: '200000000',
            label: '200000000',
            value: 0.6876642054066237,
            rawValue: 200000000
          },
          {
            id: '400000000',
            label: '400000000',
            value: 0.46034030837713946,
            rawValue: 400000000
          },
          {
            id: '600000000',
            label: '600000000',
            value: 0.23301641134765558,
            rawValue: 600000000
          },
          {
            id: '800000000',
            label: '800000000',
            value: 0.0056925143181715265,
            rawValue: 800000000
          }
        ]
      ],
      visible: true,
      pickable: true,
      orient: 'left',

      verticalFactor: 1,
      verticalLimitSize: 139
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();

    const axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.x).toBe(-40);
  });

  it('Horizontal Line Axis with no labels', () => {
    const axis = new LineAxis({
      title: {
        space: 20,
        padding: 0,
        textStyle: {
          fontSize: 14,
          fill: '#333',
          fontWeight: 'bold',
          fillOpacity: 1,
          fontFamily: 'PingFang SC'
        },
        visible: true,
        autoRotate: false,
        shape: {},
        background: {},

        text: 'date',
        maxWidth: 331
      },
      label: {
        visible: true,
        inside: false,
        space: 8,
        padding: 0,
        style: {
          fontSize: 14,
          fill: '#505050',
          fontWeight: 'normal',
          fillOpacity: 1,
          fontFamily: 'PingFang SC',
          angle: -1.0471975511965976,
          textAlign: 'end',
          textBaseline: 'middle'
        },
        autoRotate: false,
        autoHide: false,
        autoLimit: false
      },
      tick: {
        visible: false,
        inside: false,
        alignWithLabel: true,
        length: 4,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      subTick: {
        visible: false,
        inside: false,
        count: 4,
        length: 2,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      line: {
        visible: true,
        style: {
          lineWidth: 1,
          stroke: '#D9DDE4',
          strokeOpacity: 1
        }
      },
      grid: {
        style: {
          lineWidth: 1,
          stroke: '#EBEDF2',
          strokeOpacity: 1,
          lineDash: []
        },
        visible: false,
        length: 399,
        type: 'line',
        depth: 0
      },
      subGrid: {
        visible: false,
        style: {
          lineWidth: 1,
          stroke: '#EBEDF2',
          strokeOpacity: 1,
          lineDash: [4, 4]
        }
      },
      x: 121,
      y: 423,
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 331,
        y: 0
      },
      items: [[]],
      visible: true,
      pickable: true,
      orient: 'bottom',
      verticalFactor: 1,
      verticalLimitSize: 150
    });
    stage.defaultLayer.add(axis as unknown as IGraphic);
    stage.render();
    const axisTitle = axis.getElementsByName(AXIS_ELEMENT_NAME.title)[0] as unknown as Tag;
    expect(axisTitle.attribute.y).toBe(20);
    expect(axisTitle.attribute.x).toBe(165.5);
  });
});
