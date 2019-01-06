const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
const request = require('./request')
const fsCachePath = path.resolve(__dirname, '.version')

let sessionCached

module.exports = async function getVersions () {
  if (sessionCached) {
    return sessionCached
  }

  let latest
  const local = require(`../../package.json`).version
  if (process.env.CLI_TEST || process.env.CLI_DEBUG) {
    return (sessionCached = {
      current: local,
      latest: local
    })
  }

  if (fs.existsSync(fsCachePath)) {
    const cached = await fs.readFile(fsCachePath, 'utf-8')
    const lastChecked = (await fs.stat(fsCachePath)).mtimeMs
    const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24)
    if (daysPassed > 1) {
      latest = await getAndCacheLatestVersion(cached)
    } else {
      getAndCacheLatestVersion(cached)
      latest = cached
    }
  } else {
    getAndCacheLatestVersion()
    latest = local
  }


  return (sessionCached = {
    current: local,
    latest
  })
}

async function getAndCacheLatestVersion (cached) {
  const res = await getPackageVersion('@biorz/cli', 'latest')
  if (res.statusCode === 200) {
    const { version } = res.body

    if (semver.valid(version) && version !== cached) {
      await fs.writeFile(fsCachePath, version)
      return version
    }
  }
  return cached
}

async function getPackageVersion (id, range = '') {
  const registry = `https://registry.npm.taobao.org`

  let result
  try {
    result = await request.get(`${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`)
  } catch (e) {
    return e
  }
  return result
}
