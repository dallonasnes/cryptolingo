# CryptoLingo

[Web App](https://cryptolingo.netlify.app/)

[Demo videos of multiple networks](https://www.youtube.com/watch?v=QvjtdN9-rXA&list=PL4GOnlnOJjYLRFMw1FBhKMOOMeXmJafXn)

## tldr;
CryptoLingo is a dApp that offers token incentives to language teachers to create content. More importantly, it pairs text content with the author's pronunciation of the content to make a better learning experience. Learners pay to access content and the author of the content gets paid each time it's viewed. To validate content, learners vote on content they read and author payment is upvote thresholds block payment until the content quality is validated by learners.

## Usage
If you want to learn a language by reading natural stories and listening to native pronunciation, click a story and purchase it with your cryptoToken balance. After reading the story, you can earn back some of your spent cryptoTokens by voting on the content.

If you want to teach your language, write a short story in text and record yourself reading it. Then click submit. Under the hood, this data is written to IPFS. You can use the tokens you earn to purchase content to learn or cash out on an exchange.

## Tech Stack
1. IPFS - distributed data store. FE puts and fetches strings (story content) and blobs (audio files)
2. Harmony network
3. Celo network
4. Polygon network
5. Arbitrum network

## Contract Addresses
#### Celo (alfajores)
```
LingoRewards: 0x20D9c9287a077684B346E60cc489D05ac8687040
CryptoLingo: 0x1B7fC3e85419A69DD4E3C7091E584107daD3E3cB
```

#### Harmony + Polygon + Arbitrum
```
LingoRewards: 0xbF090B1288F721FDC36d5D815B34Da4a79a28dCc
CryptoLingo: 0x5eE36eb8dfB2b7edD5353b27E819723F9f640C6B
```

## How to run
#### Locally
1. Run `yarn install` in the root dir
2. Run `yarn chain` in one terminal
3. Once the first terminal is dumping ETH network logs, run `yarn deploy && yarn start` in the second terminal
#### Docker
1. See readme in `docker` dir

Thanks to [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) for the template!

## Dev Docs
[Technical Design doc](https://docs.google.com/document/d/1gAmn7V9PMnOSJFKDBoo6Bk9CBrQplZUeqGedVKhFdmw/edit?usp=sharing)
