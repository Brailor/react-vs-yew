# React vs Yew performance

The goal of this repository is to have the same application implemented with 2 different technologies (React, Yew) and measure key metrics when doing:
- Server Side Rendering a static page with not dynamic data dependency
- Server Side Rendering a page with dynamic data as dependency (when the request comes in, get some data and generate the page in the server)
- Client Side Rendering some page (JS engine vs WASM engine perf)

The key metrics are defined in the [PageSpeed Insights](https://pagespeed.web.dev/) page.
