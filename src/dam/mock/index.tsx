import type { JSX } from "react"
import { Route } from "../Route"

export const HomePage = ({ children, title }: { 
  children: JSX.Element, 
  title: string 
}) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </head>
    <body>
      {children}
    </body>
    </html>
  )
}

let route = new Route(
  <HomePage title="HomePage">
    <div>Your content here</div>
  </HomePage>
)

export default route;