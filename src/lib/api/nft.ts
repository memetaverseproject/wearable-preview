import { Wearable } from '@beland/schemas'
import { Env } from '@dcl/ui-env'
import { json } from '../json'

export const nftApiByEnv: Record<Env, string> = {
  [Env.DEVELOPMENT]: 'https://nft-api-test.beland.io/v1',
  [Env.PRODUCTION]: 'https://nft-api-test.beland.io/v1',
  stg: ''
}

class NFTApi {
  async fetchWearable(id: string, env: Env) {
    const { rows } = await json<{ rows: any[] }>(`${nftApiByEnv[env]}/items?id=${id}`)
    if (rows.length === 0) {
      throw new Error(`Item not found for id=${id}`)
    }
    const row = rows[0]
    return {
      name: row.name,
      rarity: row.traits.find((t: { name: string }) => t.name==='rarity')?.value,
      data: {
        category: row.traits.find((t: { name: string }) => t.name==='category')?.value,
        representations: row.data.representations.map((representation: { contents: { path: any; hash: string }[] }) => {
          return {
            ...representation,
            contents: representation.contents.map((content: { path: any; hash: string }) => {
              return {
                key: content.path,
                url: content.hash.replace("ipfs://", 'https://ipfs-test.beland.io/ipfs/')
              }
            })
          }
        })
      }
      
    } as Wearable
  }
  async fetchNFT(contractAddress: string, tokenId: string, nftApi: string) {
    const { rows } = await json<{ rows: { id: string; collectionItemId: string }[] }>(
      `${nftApi}/nfts?id=${contractAddress}-${tokenId}`
    )
    if (rows.length === 0) {
      throw new Error(`NFT not found for contractAddress="${contractAddress}" tokenId="${tokenId}"`)
    }
    return rows[0]
  }

  async fetchProfile(userId: string, env: Env) {
    const { rows } = await json<{ rows: any[] }>(`${nftApiByEnv[env]}/users?id=${userId}`)
    if (rows.length === 0) {
      throw new Error(`User not found for ${userId}`)
    }
    return {avatars: rows}
  }
}

export const nftApi = new NFTApi()
