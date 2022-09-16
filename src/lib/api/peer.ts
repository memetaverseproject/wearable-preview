import {
  Profile,
  WearableDefinition,
  EmoteDefinition,
  Entity,
  Emote,
  Wearable,
  EmoteRepresentationADR74,
  WearableRepresentation,
  EmoteRepresentationDefinition,
  WearableRepresentationDefinition,
} from '@beland/schemas'
import { isEmote } from '../emote'
import { json } from '../json'
import { isWearable } from '../wearable'

/**
 * Converts representations into representation definitions. Representations have contents as string[] and representation definitions have contents as { key: string, url: string}[].
 * @param entity
 * @param representations
 * @param peerUrl
 * @returns representation definitions
 */
function mapEntityRepresentationToDefinition<
  T extends WearableRepresentationDefinition | EmoteRepresentationDefinition
>(entity: Entity, representations: (EmoteRepresentationADR74 | WearableRepresentation)[], peerUrl: string): T[] {
  return representations.map((representation: any) => ({
    ...representation,
    contents: representation.contents.map((content: { path: any; hash: string }) => {
      return {
        key: content.path,
        url: content.hash.replace('ipfs://', 'https://ipfs-test.beland.io/ipfs/'),
      }
    }),
  })) as T[]
}

/**
 * Converts an entity into a wearable or an emote definition.
 * @param entity
 * @param peerUrl
 * @returns a wearable or emote definition
 */
function entityToDefinition<T extends WearableDefinition | EmoteDefinition>(entity: any, peerUrl: string): T {
  const metadata = {
    id: entity.id,
    image: entity.imageUrl,
    data: {
      ...entity.data,
      replaces: entity.traits.filter((t: { name: string }) => t.name === 'replaces').map((v: { value: any }) => v.value),
      hides: entity.traits.filter((t: { name: string }) => t.name === 'hides').map((v: { value: any }) => v.value),
      category: entity.traits.find((t: { name: string }) => t.name === 'category')?.value,
    },
    name: entity.name,
    rarity: entity.traits.find((t: { name: string }) => t.name === 'rarity')?.value,
  } as Wearable | Emote

  // this is used for the image and the thumbnail urls
  if ('emoteDataADR74' in metadata) {
    const definition: EmoteDefinition = {
      ...metadata,
      emoteDataADR74: {
        ...metadata.emoteDataADR74,
        representations: mapEntityRepresentationToDefinition<EmoteRepresentationDefinition>(
          entity,
          metadata.emoteDataADR74.representations,
          peerUrl
        ),
      },
    }
    return definition as T
  }

  const definition: WearableDefinition = {
    ...metadata,
    data: {
      ...metadata.data,
      representations: mapEntityRepresentationToDefinition<WearableRepresentationDefinition>(
        entity,
        metadata.data.representations,
        peerUrl
      ),
    },
  }
  return definition as T
}

class PeerApi {
  /**
   * Fetches the entities that represent the given pointers.
   * @param pointers List of pointers
   * @param peerUrl The url of a catalyst
   * @returns List of active entities for given pointers
   */
  async fetchEntities(pointers: string[], peerUrl: string) {
    if (pointers.length === 0) {
      return []
    }
    const entities = await json<Entity[]>(`${peerUrl}/content/entities/active`, {
      method: 'post',
      body: JSON.stringify({ pointers }),
      headers: { 'Content-Type': 'application/json' },
    })
    return entities
  }

  /**
   * Fetches the entities represented by the given urns and processes them into Wearable and Emote definitions.
   * @param urns List of urns for wearables or emotes
   * @param peerUrl The url of a Catalyst
   * @returns List of wearables and list of emotes for given urns
   */
  async fetchItems(urns: string[], peerUrl: string): Promise<[WearableDefinition[], EmoteDefinition[]]> {
    if (urns.length === 0) {
      return [[], []]
    }
    const res = await json<any>(`${peerUrl}/items?id__in=${urns.join(',')}`)
    const definitions = res.rows.map((entity: any) => entityToDefinition(entity, peerUrl))
    const wearables = definitions.filter(isWearable)
    const emotes = definitions.filter(isEmote)
    return [wearables, emotes]
  }

  async fetchProfile(profile: string, peerUrl: string) {
    const profiles = await json<Profile[]>(`${peerUrl}/users?id=${profile}`).then((r: any) => r.rows)
    return { avatars: profiles }
  }
}

export const peerApi = new PeerApi()
