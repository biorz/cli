const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
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
    latest = local
  }

  return (sessionCached = {
    current: local,
    latest
  })
}

async function getAndCacheLatestVersion (cached) {
  const res = await getPackageVersion('design', 'latest') // todo:  
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
  let result
  try {
    result = await get(`${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`)
  } catch (e) {
    return e
  }
  return result
}

async function get (uri) {
  const request = require('request-promise-native')
  const reqOpts = {
    method: 'GET',
    resolveWithFullResponse: true,
    json: true,
    uri
  }

  return request(reqOpts)
}

