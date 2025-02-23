---
title: PDF Content
---

1 Introduction

1.1 Problem

On Proof-of-Stake networks, entities provide valuable currency to validators to
provide economic security for the network. In return for locking these tokens and
operating infrastructure, stakers receive rewards proportional to locked tokens.

To mitigate the ability for someone to buy tokens, stake, attack the network,
and then quickly unstake to convert back to the original asset, there is usually
an unbonding period when trying to unstake tokens. Due to this structure,
traditional stake has zero access to liquidity or the DeFi ecosystem. Also, traditional staking UX is cumbersome: researching operators, distributing stake,
accounting and more are all painful processes.


1.2 Solution

Liquid staking solves the typical mutual exclusivity of staking, allowing users to
earn rewards without sacrificing access to liquidity or usage across DeFi. In addition to these obvious benefits, liquid staking helps users by (non-exhaustive):
- Simplicity: users can stake with stELX in less than 30 seconds and start earning rewards immediately.
- Rewards: validator selection optimized by rewards. operators in the set are given alpha to increase rewards.
- Diversification: stELX has a large and elite validator set – you don’t have to rely on one infrastructure provider.

1.3 Liquid Staking, Simplified

Liquid staking allows users to stake any amount of ELX in one-click and start
earning rewards instantly. They’ll receive stELX representative tokens which
they can hold in their wallet or use in DeFi. Users can sell their stELX via
an AMM or on spot to avoid the unstaking period. stELX is backed by ELX
staked onto validators that earns rewards.

Simplified Fund Flow
- Send ELX to a publicly accessible smart contract
- Receive a 1:1 amount of stELX
- Every block, validators earn rewards which increases the your stELX balance

![alt text](<スクリーンショット 2025-02-24 2.43.59.png>)


1.4 Network Effects & Network Benefits

LSTs create significant network effects on the greater DeFi ecosystem. stETH
on Ethereum is a great case study, where $7b of stETH is used as collateral
across DeFi protocols such as Aave.

From the network perspective, LSTs:
- Bring the largest source of sustainable yield into DeFi and make DeFi offerings more compelling
- Increase the performance and decentralization of the underlying network
- Increase the total economic security of the network

2 Institutional-Specific Benefits

2.1 Access to Instant Liquidity

When holding a significant position in any asset, access to instant liquidity is
crucial in the event of substantial market oscillations or mitigation of opportunity cost. This access is unavailable in the context of traditional staking; there
is a 7-day minimum between unstaking and receiving tradeable tokens on Elixir.

StakedELX ensures constant access to liquidity by:
- Using a proprietary market that’s a combination of a lending market and traditional dex to maximize capital efficiency
- Running arbitrage strategies to ensure that stELX is never at a significant discount
- Putting aside incoming mints to fulfill any large pending redemptions
- Partnering with lending markets to offer high LTV options to collateralize your stELX

It is also important to note that a direct redemption mechanism will always be available, offering a guaranteed no-discount redemption that will take the same time as any traditional delegated unstake.

2.2 Use in DeFi

stELX creates more routes to access yield:
- Lending markets: deposit stELX into a lending market and borrow another asset for trading or yield farming activities
- Leveraged staking: deposit stELX into a lending protocol as collateral, borrow ELX, stake it, and repeat this process as many times as risk tolerance allows.
- Providing liquidity in a redemption pool: this is a low risk strategy that earns fees based off the stELX:ELX market.
- Fixed rate: Use Pendle to lock-in a fixed rate of yield, or leverage yield

2.3 Optimized Rewards

The StakedELX operator set is selected to ensure that stELX validators are the
most performant and secure as possible. Validators that do not uphold excellent
performance and iron-clad security practices will be removed from the set.

In addition to partnering with external validators, Thunderhead Labs employs an in-house infrastructure team, allowing us to objectively judge and advise our partners infrastructure practices.

3 Security

3.1 Non Custodial

All stages of fund-flow are controlled by the protocol and our holder-focused
governance mechanism. The Thunderhead team is never in possession or control
of any user funds.

3.2 Dual-Arm Governance Mechanism

To minimize governance risk while still leaving necessary optionality for upgrades, new operators, and parameter changes, we have pioneered a dual-arm
governance system.

3.2.1 Legislative

The actor that proposes new governance proposals, suchas protocol upgrades
or operator onboarding, is controlled by a multisig composed of members of the
Thunderhead team and other reputable members of the community. For a new
proposal to be created, it must be approved by this multisig before entering the
protocol for voting.

3.2.2 Executive

This system approves proposals proposed by the legislative branch. It is simply
a weighted popular vote of stELX token holders. So, if a malicious proposal is
created, the users of stELX have the sole power to veto the proposal (a quorum
must be hit). All proposals are considered optimistic so if quorum is not hit,
the proposal will pass.

![alt text](<スクリーンショット 2025-02-24 3.07.06.png>)

3.3 Protocol Level

Hacks and exploits are some of the biggest threats to broader DeFi and are
something we take extremely seriously. Our team has prior experience building
LSTs and securing protocols. In addition to building previously audited and
secure LSTs, our co-founder white-hatted curve for $6m.

4 Risk

Despite best efforts, stELX still exhibits elements of risk. These risks fall into
a few main categories:

4.1 Long-Tail Risk
These are risks that are extremely unlikely to occur but are problematic for the
protocol.

4.1.1 Hack

A smart-contract vulnerability could cause loss of funds; however, it is unlikely
that the totality of underlying ELX tokens will be stolen because there is a
mandatory 7-day unstaking period. In the event of a protocol hack, an attacker
could take all free ELX or rug the liquidity pool, which would represent
< 1−3% of outstanding stELX. 

It could be theoretically possible for an attacker
to hack the governance mechanism to place the protocol in an irrecoverable
state. We do our best to mitigate these risks by contracting multiple audits
and instituting our dual-governance model, but risks like these are impossible
to completely mitigate.

4.1.2 Operational Risk

Possible hack vectors outside of a direct smart-contract vulnerability could be
an op-sec breach. Notably executed by DPRK in their numerous supply-chain
hacks, a possible attack vector on stELX could be infecting hardware belonging
to members of the legislative multisig and pushing a malicious proposal to be
voted on by stELX holders. If the team unknowingly pushes for this proposal,
it could slip by the radar of the community. 

This risk is mitigated by
- Ensuring all members of the multisig use a dedicated and airgapped piece of hardware to avoid supply-chain hacks
- A vigilant and active stELX community to vet proposals regardless of what the official team advertises
- Public and transparent software that documents and notifies upon proposal creation

4.1.3 Systemic Risk

stELX depends on Elixir and Ethereum as a whole, subjecting it to unavoidable
systemic risk if the underlying protocol is hacked or broken. For example, if
there is some protocol bug and a major slashing event occurs, funds would be
lost.

4.2 Depeg Event

A depeg event happens when the market rate of the LST becomes significantly
lower than the backing value. We plan on mitigating the likelihood of one of
these events by creating a robust and liquid market (see 2.1). Additionally,
a depegging event does not result in any funds lost. Anybody can
redeem their stELX for ELX at no discount, subject to the Elixir
enforced unstaking period.

5 Miscellaneous

5.1 Where is Thunderhead Labs based?

Thunderhead Labs is a U.S. based company, and all three co-founders are KYC’d
and doxxed United States citizens.

6 Contact

If you have any questions or notes about the protocol, please contact us at damon@thunderhead.xyz, pierre@thunderhead.xyz, or addison@thunderhead.xyz.
Or feel free to reach out on telegram @reachingarete, @addisonthunderhead,
@thunderheaddamon
