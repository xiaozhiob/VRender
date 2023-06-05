import { IndicatorAttributes } from './type';
export const DEFAULT_INDICATOR_THEME: Partial<IndicatorAttributes> = {
  title: {
    style: {
      text: '',
      fontSize: 20,
      fill: true,
      fillColor: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  },
  content: {
    style: {
      text: '',
      fontSize: 16,
      fill: true,
      fillColor: 'black',
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  }
};
