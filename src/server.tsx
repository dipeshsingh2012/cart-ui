import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CartFragment } from './components/CartFragment';

export function render(props: any = {}): string {
  return ReactDOMServer.renderToString(React.createElement(CartFragment, props));
}

export { CartFragment };
export default CartFragment;
