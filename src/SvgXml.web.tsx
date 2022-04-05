import React from 'react';
import {
  ViewProps,
  GestureResponderHandlers,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import { unstable_createElement as uce } from 'react-native-web';
import useElementLayout from 'react-native-web/dist/modules/useElementLayout';
import usePlatformMethods from 'react-native-web/dist/modules/usePlatformMethods';
import useResponderEvents from 'react-native-web/dist/modules/useResponderEvents';
import useMergeRefs from 'react-native-web/dist/modules/useMergeRefs';
import * as forwardedProps from 'react-native-web/dist/modules/forwardedProps'
import pick from 'react-native-web/dist/modules/pick'

const forwardPropsList = {
  ...forwardedProps.defaultProps,
  ...forwardedProps.accessibilityProps,
  ...forwardedProps.clickProps,
  ...forwardedProps.focusProps,
  ...forwardedProps.keyboardProps,
  ...forwardedProps.mouseProps,
  ...forwardedProps.touchProps,
  ...forwardedProps.styleProps,
}

const pickProps = (props: ViewProps) => pick(props, forwardPropsList)

// rgba values inside range 0 to 1 inclusive
// rgbaArray = [r, g, b, a]
export type rgbaArray = ReadonlyArray<number>;

// argb values inside range 0x00 to 0xff inclusive
// int32ARGBColor = 0xaarrggbb
export type int32ARGBColor = number;
type NumberProp = string | number;
type Color = int32ARGBColor | rgbaArray | string;
type FillRule = 'evenodd' | 'nonzero';
type Linecap = 'butt' | 'square' | 'round';
type Linejoin = 'miter' | 'bevel' | 'round';
type NumberArray = NumberProp[] | NumberProp;
/*

  ColumnMajorTransformMatrix

  [a, b, c, d, tx, ty]

  This matrix can be visualized as:

  ╔═      ═╗
  ║ a c tx ║
  ║ b d ty ║
  ║ 0 0 1  ║
  ╚═      ═╝

*/
type ColumnMajorTransformMatrix = [
  number,
  number,
  number,
  number,
  number,
  number,
];
interface ClipProps {
  clipRule?: FillRule;
  clipPath?: string;
}
interface FillProps {
  fill?: Color;
  fillOpacity?: NumberProp;
  fillRule?: FillRule;
}
interface StrokeProps {
  stroke?: Color;
  strokeWidth?: NumberProp;
  strokeOpacity?: NumberProp;
  strokeDasharray?: ReadonlyArray<NumberProp> | NumberProp;
  strokeDashoffset?: NumberProp;
  strokeLinecap?: Linecap;
  strokeLinejoin?: Linejoin;
  strokeMiterlimit?: NumberProp;
}
interface TransformObject {
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
}
interface TransformProps extends TransformObject {
  transform?: ColumnMajorTransformMatrix | string | TransformObject;
}
interface ResponderProps extends GestureResponderHandlers {
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}
interface VectorEffectProps {
  vectorEffect?:
  | 'none'
  | 'non-scaling-stroke'
  | 'nonScalingStroke'
  | 'default'
  | 'inherit'
  | 'uri';
}

interface TouchableProps {
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  delayPressIn?: number;
  delayPressOut?: number;
  delayLongPress?: number;
}
interface DefinitionProps {
  id?: string;
}

interface CommonMarkerProps {
  marker?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
}

interface CommonMaskProps {
  mask?: string;
}

interface CommonPathProps
  extends FillProps,
  StrokeProps,
  ClipProps,
  TransformProps,
  VectorEffectProps,
  ResponderProps,
  TouchableProps,
  DefinitionProps,
  CommonMarkerProps,
  CommonMaskProps { }
interface GProps extends CommonPathProps {
  opacity?: NumberProp;
}
export interface SvgProps extends GProps, ViewProps {
  width?: NumberProp;
  height?: NumberProp;
  viewBox?: string;
  preserveAspectRatio?: string;
  color?: Color;
  title?: string;
}

export interface XmlProps extends SvgProps {
  xml: string | null;
  override?: SvgProps;
}

const SvgXml = React.forwardRef<HTMLOrSVGElement, XmlProps>(
  ({ xml, ...props }: XmlProps, forwardedRef) => {
    const { innerSVG, svgAttributes } = React.useMemo(() => {
      const { attributes, innerHTML } = parseSVG(xml || '');
      return { innerSVG: innerHTML, svgAttributes: kebabToCamel(attributes) };
    }, [xml]);

    const svgRef = React.useRef<SVGElement>(null);
    React.useLayoutEffect(() => {
      if (!svgRef.current) {
        return;
      }
      svgRef.current.innerHTML = innerSVG;
    }, [innerSVG]);

    const {
      height,
      width,
      viewBox,
      preserveAspectRatio,
      title,
      opacity,
      fill,
      fillOpacity,
      fillRule,
      transform,
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
      vectorEffect,
      id,
      markerStart,
      markerMid,
      markerEnd,
      mask,
      originX,
      originY,
      translate,
      scale,
      rotation,
      skewX,
      skewY,
      style,
      // props that should be applyed to the View container
      ...containerProps
    } = props;

    const svgTransform = React.useMemo<string>(() => {
      const transformArray: string[] = [];
      if (originX != null || originY != null) {
        transformArray.push(`translate(${originX || 0}, ${originY || 0})`);
      }
      if (translate != null) {
        transformArray.push(`translate(${translate})`);
      }
      if (scale != null) {
        transformArray.push(`scale(${scale})`);
      }
      // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
      if (rotation != null) {
        transformArray.push(`rotate(${rotation})`);
      }
      if (skewX != null) {
        transformArray.push(`skewX(${skewX})`);
      }
      if (skewY != null) {
        transformArray.push(`skewY(${skewY})`);
      }
      if (originX != null || originY != null) {
        transformArray.push(
          `translate(${-(originX || 0)}, ${-(originY || 0)})`,
        );
      }
      if (transform) {
        transformArray.push(transform as string);
      }
      return transformArray.length ? transformArray.join(' ') : undefined;
    }, [originX, originY, rotation, scale, skewX, skewY, transform, translate]);

    const { svgStyle, containerStyle } = React.useMemo(() => {
      const [, , widthBox, heightBox] = (viewBox || '').split(' ');
      const {
        width: styleWidth,
        height: styleHeight,
        minHeight,
        minWidth,
        maxHeight,
        maxWidth,
        ...containerStyle
      } = StyleSheet.flatten(style);
      return {
        svgStyle: {
          width: width || styleWidth || svgAttributes.width || widthBox,
          height: height || styleHeight || svgAttributes.height || heightBox,
          minHeight,
          minWidth,
          maxHeight,
          maxWidth,
        },
        containerStyle
      };
    }, [
      svgAttributes.height,
      svgAttributes.width,
      height,
      style,
      viewBox,
      width,
    ]);

    // these props should override the xml props
    const overrideProps = React.useMemo(
      () => ({
        ...removeUndefined(svgAttributes),
        ...removeUndefined({
          style: svgStyle,
          transform: svgTransform,
          viewBox,
          preserveAspectRatio,
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
          vectorEffect,
          pointerEvents: 'none',
          id,
          markerStart,
          markerMid,
          markerEnd,
          mask,
        }),
      }),
      [
        svgAttributes,
        clipPath,
        clipRule,
        fill,
        fillOpacity,
        fillRule,
        id,
        markerEnd,
        markerMid,
        markerStart,
        mask,
        opacity,
        preserveAspectRatio,
        stroke,
        strokeDasharray,
        strokeDashoffset,
        strokeLinecap,
        strokeLinejoin,
        strokeMiterlimit,
        strokeOpacity,
        strokeWidth,
        svgStyle,
        svgTransform,
        title,
        vectorEffect,
        viewBox,
      ],
    );

    const Svg = uce('svg', { ref: svgRef, ...overrideProps });

    const {
      onLayout,
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
      ...finalProps
    } = containerProps

    const finalContainerProps = pickProps({ ...finalProps, style: containerStyle })

    const hostRef = React.useRef<HTMLDivElement>(null)
    useElementLayout(hostRef, onLayout)
    const responderConfig = React.useMemo(
      () => ({
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,
      }),
      [
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,
      ]
    )
    useResponderEvents(hostRef, responderConfig)

    const platformMethodsRef = usePlatformMethods({ ...finalContainerProps, classList })

    const setRef = useMergeRefs(hostRef, platformMethodsRef, forwardedRef)

    return uce('span', {
      ...finalContainerProps,
      classList,
      ref: setRef,
    }, Svg);
  },
);

SvgXml.displayName = 'Svg';

export default SvgXml;

/** polyfill for Node < 12 */
function matchAll(str: string) {
  return (re: RegExp) => {
    const matches = [];
    let groups;
    while ((groups = re.exec(str))) {
      matches.push(groups);
    }
    return matches;
  };
}

function parseSVG(svg: string) {
  const contentMatch = svg.match(/<svg(.*)<\/svg>/ims);
  const content = contentMatch ? contentMatch[1] : '';
  const [, attrs, innerHTML] = content.match(/(.*?)>(.*)/ims) || ['', '', ''];
  const attributes = [
    ...matchAll(attrs)(/([a-z0-9-]+)(=['"](.*?)['"])?/gims),
  ].map(([, key, , value]) => ({ [key]: value }));
  return { attributes, innerHTML };
}

const styleSheet = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'inline-flex' as 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    color: 'inherit',
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0,
  },
})
const classList = [styleSheet.view]

interface ParsedProp {
  [key: string]: unknown;
}

function kebabToCamel(attrs: ParsedProp[]) {
  const camelObj: ParsedProp = {};
  attrs.forEach(attr => {
    const key = Object.keys(attr)[0];
    camelObj[key.replace(/-./g, x => x.toUpperCase()[1])] = attr[key];
  });
  return camelObj;
}

function removeUndefined(obj: ParsedProp) {
  const finalObj: ParsedProp = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      finalObj[key] = obj[key];
    }
  });
  return finalObj;
}
