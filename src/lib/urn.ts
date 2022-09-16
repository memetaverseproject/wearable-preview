export function isBodyShape(urn: string) {
  return (
    urn.startsWith('urn:beland:off-chain:base-avatars:') &&
    (urn.endsWith('BaseMale') || urn.endsWith('BaseFemale'))
  )
}
