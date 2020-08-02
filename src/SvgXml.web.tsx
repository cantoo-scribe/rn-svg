import React from 'react';
import { ViewProps } from 'react-native';
import { View, unstable_createElement } from 'react-native-web';
import { XmlProps } from './xml';
type SvgXmlProps = XmlProps &
  ViewProps & {
    height: number | string;
    width: number | string;
    viewBox?: string;
    preserveAspectRatio?: string;
    color?: string;
    title?: string;
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
      // props that should be applyed to the View container
      ...containerProps
    } = props;

    // these props should override the xml props
    const overrideProps = {
      height,
      width,
      viewBox,
      preserveAspectRatio,
      color,
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
