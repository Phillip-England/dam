import type { JSX } from "react"

export class Route {
  jsxComponent: JSX.Element;
  routeType: number;
  // routeType 0 = static
  // routeType 1 = server
  // routeType 2 = client
  constructor(jsxComponent: JSX.Element) {
    this.jsxComponent = jsxComponent;
    this.routeType = 0;
  }
}