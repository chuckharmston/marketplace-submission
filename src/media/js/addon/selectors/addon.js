export function addonListSelector(addons={}) {
  return Object.keys(addons)
               .sort()
               .map(slug => addons[slug]);
}


export function versionListSelector(versions={}) {
  return Object.keys(versions)
               .sort()
               .reverse()
               .map(id => versions[id]);
}
