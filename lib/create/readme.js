'use strict'

export default function createReadme(settings) {
  return `
    # ${settings.title}
    [${settings.url}](${settings.url})

    ${settings.description}

    By: ${settings.author}
  `
}
