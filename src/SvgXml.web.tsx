import React from 'react';
import { ViewProps } from 'react-native';
import { View, unstable_createElement } from 'react-native-web';
import { XmlProps } from './xml';
// rgba values inside range 0 to 1 inclusive
// rgbaArray = [r, g, b, a]
export type rgbaArray = ReadonlyArray<number>;

// argb values inside range 0x00 to 0xff inclusive
// int32ARGBColor = 0xaarrggbb
export type int32ARGBColor = number;
type NumberProp = string | number;
type FillRule = 'evenodd' | 'nonzero';
type Linecap = 'butt' | 'square' | 'round';
type Linejoin = 'miter' | 'bevel' | 'round';
type Color = int32ARGBColor | rgbaArray | string;
type NumberArray = NumberProp[] | NumberProp;

type SvgXmlProps = XmlProps &
  ViewProps & {
    height: NumberProp;
    width: NumberProp;
    viewBox?: string;
    preserveAspectRatio?: string;
    color?: Color;
    title?: string;
    opacity?: NumberProp;
    fill?: Color;
    fillOpacity?: number;
    fillRule?: FillRule;
    stroke?: Color;
    strokeWidth?: NumberProp;
    strokeOpacity?: NumberProp;
    strokeDasharray?: ReadonlyArray<NumberProp> | NumberProp;
    strokeDashoffset?: NumberProp;
    strokeLinecap?: Linecap;
    strokeLinejoin?: Linejoin;
    strokeMiterlimit?: NumberProp;
    clipRule?: FillRule;
    clipPath?: string;
    translate?: NumberArray;
    translateX?: NumberProp;
    translateY?: NumberProp;
    origin?: NumberArray;
    originX?: NumberProp;
    originY?: NumberProp;
    scale?: NumberArray;
    scaleX?: NumberProp;
    scaleY?: NumberProp;
    skew?: NumberArray;
    skewX?: NumberProp;
    skewY?: NumberProp;
    rotation?: NumberProp;
    x?: NumberArray;
    y?: NumberArray;
    vectorEffect?:
      | 'none'
      | 'non-scaling-stroke'
      | 'nonScalingStroke'
      | 'default'
      | 'inherit'
      | 'uri';
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
    id?: string;
    marker?: string;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
    mask?: string;
  };
const SvgXml = React.forwardRef<HTMLOrSVGElement, SvgXmlProps>(
  ({ xml, ...props }, fowardRef) => {
    const { attributes, innerSVG } = parseSVG(xml);
    const camelAttributes = kebabToCamel(attributes);

    const svgRef = React.createRef<SVGElement>();
    React.useLayoutEffect(() => {
      if (!svgRef.current) {
        return;
      }
      svgRef.current.innerHTML = innerSVG;
    }, [innerSVG, svgRef]);

    const {
      height,
      width,
      viewBox,
      preserveAspectRatio,
      color,
      title,
      opacity,
      fill,
      fillOpacity,
      fillRule,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeDasharray,
      strokeDashoffset,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      clipRule,
      clipPath,
      translate,
      translateX,
      translateY,
      origin,
      originX,
      originY,
      scale,
      scaleX,
      scaleY,
      skew,
      skewX,
      skewY,
      rotation,
      x,
      y,
      vectorEffect,
      pointerEvents,
      id,
      marker,
      markerStart,
      markerMid,
      markerEnd,
      mask,
      // props that should be applyed to the View container
      ...containerProps
    } = props;

    // these props should override the xml props
    const overrideProps = {
      height: '100%',
      width: '100%',
      viewBox,
      preserveAspectRatio,
      color,
      title,
      opacity,
      fill,
      fillOpacity,
      fillRule,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeDasharray,
      strokeDashoffset,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      clipRule,
      clipPath,
      translate,
      translateX,
      translateY,
      origin,
      originX,
      originY,
      scale,
      scaleX,
      scaleY,
      skew,
      skewX,
      skewY,
      rotation,
      x,
      y,
      vectorEffect,
      pointerEvents,
      id,
      marker,
      markerStart,
      markerMid,
      markerEnd,
      mask,
    };

    const finalProps = { ...camelAttributes, ...overrideProps };
    const Svg = unstable_createElement('svg', { ref: svgRef, ...finalProps });

    const containerDefaultStyles = {
      width,
      height,
    };
    return (
      <View ref={fowardRef} {...containerProps} style={containerDefaultStyles}>
        {Svg}
      </View>
    );
  },
);

SvgXml.displayName = 'Svg';

export default SvgXml;

/** polyfill for Node < 12 */
function matchAll(str) {
  return re => {
    const matches = [];
    let groups;
    while ((groups = re.exec(str))) {
      matches.push(groups);
    }
    return matches;
  };
}

function parseSVG(svg: string) {
  const content = svg.match(/<svg(.*)<\/svg>/ims)[1];
  const [, attrs, innerSVG] = content.match(/(.*?)>(.*)/ims);
  const attributes = [
    ...matchAll(attrs)(/([a-z0-9]+)(=['"](.*?)['"])?[\s>]/gims),
  ].map(([, key, , value]) => ({ [key]: value }));
  return { attributes, innerSVG };
}

function kebabToCamel(obj) {
  const camelObj = {};
  Object.keys(obj).forEach(key => {
    camelObj[key.replace(/-./g, x => x.toUpperCase()[1])] = obj[key];
  });
  return camelObj;
}
