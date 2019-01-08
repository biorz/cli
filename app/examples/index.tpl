<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_137970_p1tpzmomxp9cnmi.css">
    <link rel='mask-icon' href="https://raw.githubusercontent.com/ElemeFE/element/dev/examples/assets/images/element-logo-small.svg" color="#ff8463">
    <title>Element</title>
  </head>
  <body>
    <div id="app"></div><% if (process.env.NODE_ENV === 'production') { %>
    <script src="//cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.runtime.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/vue-router@2.7.0/dist/vue-router.min.js"></script><% } %>
  </body>
  <% if (process.env.NODE_ENV === 'production') { %><script>
    window.addEventListener('hashchange', function () {
      ga('set', 'page', window.location.href);
      ga('send', 'pageview');
    });
  </script><% } %>
</html>
