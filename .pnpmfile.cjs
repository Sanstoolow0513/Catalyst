// .pnpmfile.cjs

/**
 * 此文件用于配置 pnpm 的 hook，允许对包的 manifest (package.json) 进行动态修改。
 * @see https://pnpm.io/pnpmfile
 */
function readPackage(pkg, context) {
  // 对于 electron 和 esbuild，我们允许它们执行安装脚本。
  // 这是通过移除 pnpm 对 'preinstall', 'install', 'postinstall' 脚本的限制来实现的。
  // 在现代 pnpm 中，更推荐的做法是在 package.json 中使用 "pnpm.onlyBuiltDependencies"。
  // 但通过 pnpmfile 的方式提供了更灵活的控制。
  //
  // 我们在这里通过一个技巧来“欺骗”pnpm，让它认为这个包没有需要执行的危险脚本。
  // 但实际上，pnpm v7+ 已经足够智能，通常只需要在 package.json 中配置即可。
  // 为了确保兼容性和明确性，我们在这里使用 hook。
  //
  // 经过验证，对于 pnpm v7+, 最简单的 hook 是直接返回 pkg，
  // 并在 package.json 中配置 `pnpm.onlyBuiltDependencies`。
  //
  // 为了解决您的问题，我们采取更直接的方式：
  // 告诉 pnpm，当它读取到 electron 或 esbuild 的 package.json 时，
  // 允许其构建。
  if (pkg.name === 'electron' || pkg.name === 'esbuild') {
    // 对于 pnpm v8+, 你可以设置 pkg.requiresBuild = true
    // 对于更广泛的兼容性，我们不修改脚本，而是依赖于 pnpm 的配置。
    // 这个 hook 文件本身的存在，加上正确的 package.json 配置，是最佳实践。
    //
    // 让我们采用最简单且有效的 hook：
    // 允许 electron 和 esbuild 运行它们的构建脚本。
    // pnpm v8+ 引入了 `requiresBuild` 属性。
    if (pkg.name === 'electron' || pkg.name === 'esbuild') {
        pkg.requiresBuild = true;
    }
  }
  
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};