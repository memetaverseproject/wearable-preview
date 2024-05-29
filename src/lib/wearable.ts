import { BodyShape, EmoteDefinition, WearableCategory, WearableDefinition } from '@mtvproject/schemas'
import { isEmote } from './emote'

export function getWearableByCategory(wearables: WearableDefinition[], category: WearableCategory) {
  return wearables.find((wearable) => wearable.data.category === category) || null
}

export function getFacialFeatureCategories() {
  return [WearableCategory.EYES]
}

export function getNonFacialFeatureCategories() {
  return [WearableCategory.HAIR, WearableCategory.UPPER_BODY, WearableCategory.LOWER_BODY, WearableCategory.FEET]
}

export function getDefaultCategories() {
  return [
    WearableCategory.EYES,
    WearableCategory.HAIR,
    WearableCategory.UPPER_BODY,
    WearableCategory.LOWER_BODY,
    WearableCategory.FEET,
  ]
}

export function getDefaultWearableUrn(category: WearableCategory, shape: BodyShape) {
  switch (category) {
    case WearableCategory.EYES:
      return shape === BodyShape.MALE
        ? 'urn:memetaverse:off-chain:base-avatars:m_eyes_00'
        : 'urn:memetaverse:off-chain:base-avatars:f_eyes_00'
    case WearableCategory.HAIR:
      return shape === BodyShape.MALE
        ? 'urn:memetaverse:off-chain:base-avatars:m_hair_02'
        : 'urn:memetaverse:off-chain:base-avatars:f_hair_06'
    case WearableCategory.UPPER_BODY:
      return shape === BodyShape.MALE
        ? 'urn:memetaverse:off-chain:base-avatars:m_ubody_06'
        : 'urn:memetaverse:off-chain:base-avatars:f_ubody_10'
    case WearableCategory.LOWER_BODY:
      return shape === BodyShape.MALE
        ? 'urn:memetaverse:off-chain:base-avatars:m_lbody_02'
        : 'urn:memetaverse:off-chain:base-avatars:f_lbody_02'
    case WearableCategory.FEET:
      return shape === BodyShape.MALE
        ? 'urn:memetaverse:off-chain:base-avatars:m_feet_01'
        : 'urn:memetaverse:off-chain:base-avatars:f_feet_05'
    default:
      throw new Error(`There is no default wearable for category="${category}"`)
  }
}

export function isWearable(value: WearableDefinition | EmoteDefinition | void): value is WearableDefinition {
  return !!value && 'data' in value && !isEmote(value)
}

export function getBodyShape(definition: WearableDefinition): BodyShape {
  const bodyShapes = [BodyShape.MALE, BodyShape.FEMALE]
  return (
    bodyShapes.find((bodyShape) =>
      definition.data.representations.some((representation) => representation.bodyShapes.includes(bodyShape))
    ) || bodyShapes[0]
  )
}
