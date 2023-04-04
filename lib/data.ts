export const testUsers = [
  {
    userId: 55301,
    name: "Spencer Bills",
    socialMedias: [
      {
        type: "facebook",
        url: "facebook.com"
      }
    ],
    stingId: 1
  },
  {
    userId: 55302,
    name: "Westin Park",
    socialMedias: [
      {
        type: "facebook",
        url: "facebook.com"
      }
    ],
    stingId: 2
  }
]

export const testSting = [
  {
    stingNumber: 1,
    members: testUsers.filter(u => u.stingId === 55302)
  },
  {
    stingNumber: 2,
    members: testUsers
  }
]