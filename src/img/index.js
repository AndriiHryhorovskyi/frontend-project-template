const requireTest = require.context(
  "../../src/img",
  true,
  /\.(gif|ico|png|svg|jpe?g)$/
);
requireTest.keys().forEach(requireTest);
