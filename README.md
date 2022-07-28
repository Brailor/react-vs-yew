# Next.js vs Yew performance

The goal of this repository is to have the same application implemented with 2 different technologies (Next.js, Yew) that enable end-to-end web application development using the same language and measure key metrics when doing:
- Server Side Rendering the homepage (node.js runtime vs rust runtime perf)
- Client Side Rendering some page (JS engine vs WASM engine perf)

The key metrics are defined in the [PageSpeed Insights](https://pagespeed.web.dev/) page.
