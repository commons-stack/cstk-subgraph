# CSTK Subgraph

- [Subgraph Endpoint](https://api.thegraph.com/subgraphs/name/mendesfabio/commons-stack-membership)

## CSTK Information

```gql
{
  token(id: "0xc4fbE68522ba81a28879763C3eE33e08b13c499E") {
    name
    symbol
    numMembers
    totalSupply
    snapshots {
      timestamp
      numMembers
      totalSupply
    }
  }
}
```

## Member Information

```gql
{
  member(id: "MEMBER_ADDRESS") {
    balance
    startDate
    expireDate
    snapshots {
      timestamp
      balance
    }
  }
}
```

## Notes

- MemberSnapshots and TokenSnapshots entities provide daily information for holders/supply growth charts.
- The fields `startDate` and `expireDate` should be used to determine whether a membership is active.
