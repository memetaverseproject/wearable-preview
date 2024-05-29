export function isBodyShape(urn: string) {
  return (
    urn.startsWith('urn:memetaverse:off-chain:base-avatars:') &&
    (urn.endsWith('BaseMale') || urn.endsWith('BaseFemale'))
  )
}
