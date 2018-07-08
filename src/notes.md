# To Dos
- Implement Redux
- Implement Routing

# Pages
## Landing
/
- Show Info about service
- Login Button
    - If already got a token send to Dashboard
    - If already got a ReqToken transform to token
    - Else redirect to Pocket login

## Dashboard
/Dashboard
- Show next delivery [Get User Deliveries]
    - What will be included [Read the query and execute it directly to Pocket to retrieve current elements]
    - Show Query options
    - Edit button [Go to Delivery Edit]
- If no deliveries show button to add one [Go to Delivery Edit]

## Delivery Edit
/Delivery
- Show delivert options
    - State
    - How many articles (By number | By time)
    - Include untagged?
    - Included tags [Text only, retrieving is not possible]
    - Excluded tags [Text only, retrieving is not possible]
    - Exclude Articles with video?
    - Archive after sending?
    - Domain 
    - Sort (Newest/Oldest)
    - Kindle Email [Save to localstorage?]
    - Frequency (One Time, Daily, Weekly, Monthly, Set hour)
- Preview Button [Executes query directly to Pocket]
- Save [Sends the query data]

# Server API
- /Auth
    - GET [Receives a RedirectUrl, Returns login URL + ReqToken]
    - POST [Receives ReqToken, returns Token] [Save token to DB, Create user, retrieve user]

- /Article
    - GET [Receives query, returns articles]
    - PATCH [Receives token + articleId + op, returns bool]

- /Delivery
    - GET [Receives userId, returns deliveries]
    - GET(DeliveryID) [Receives deliveryId, returns delivery]
    - POST [Receives delivery, returns delivery]
    - PATCH(DeliveryID) [Receives delivery, returns delivery]
    - DELETE(DeliveryID) [Receives delivery, returns bool]

- /Develivery/Processing
    - GET(DeliveryID): Executes article query, retrieves articles, builds epub, sends email